import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../config/database';
import { CreateProblemDto, FilterProblemsDto, UpdateProblemDto } from './problems.dto';

const include: Prisma.ProblemInclude = {
  category: true,
  investigator: { select: { id: true, email: true, username: true, fullName: true } },
  manager: { select: { id: true, email: true, username: true, fullName: true } },
};

@Injectable()
export class ProblemsService {
  constructor(private db: DatabaseService) {}

  async create(dto: CreateProblemDto, investigatorId: string) {
    const ticketNumber = await this.generateTicketNumber();
    return this.db.problem.create({
      data: { ...dto, ticketNumber, investigatorId, status: 'investigacion' },
      include,
    });
  }

  async findAll(filters: FilterProblemsDto) {
    const { page = 1, limit = 20, status, priority, categoryId } = filters;
    const where: Prisma.ProblemWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(categoryId && { categoryId }),
    };
    const [data, total] = await Promise.all([
      this.db.problem.findMany({ where, include, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.db.problem.count({ where }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const problem = await this.db.problem.findFirst({ where: { id, deletedAt: null }, include });
    if (!problem) throw new NotFoundException(`Problem ${id} not found`);
    return problem;
  }

  async update(id: string, dto: UpdateProblemDto) {
    await this.findOne(id);
    return this.db.problem.update({ where: { id }, data: dto, include });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.problem.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getStats() {
    const [total, investigacion, resuelto, cerrado] = await Promise.all([
      this.db.problem.count({ where: { deletedAt: null } }),
      this.db.problem.count({ where: { deletedAt: null, status: 'investigacion' } }),
      this.db.problem.count({ where: { deletedAt: null, status: 'resuelto' } }),
      this.db.problem.count({ where: { deletedAt: null, status: 'cerrado' } }),
    ]);
    return { total, investigacion, resuelto, cerrado };
  }

  private async generateTicketNumber(): Promise<string> {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await this.db.problem.count();
    return `PRB-${ym}-${String(count + 1).padStart(5, '0')}`;
  }
}
