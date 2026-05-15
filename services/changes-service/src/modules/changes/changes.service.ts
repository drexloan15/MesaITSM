import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from '../../config/database';
import { CreateChangeRequestDto, FilterChangesDto, UpdateChangeRequestDto } from './changes.dto';

const include: Prisma.ChangeRequestInclude = {
  category: true,
  requester: { select: { id: true, email: true, username: true, fullName: true } },
  manager: { select: { id: true, email: true, username: true, fullName: true } },
  deliveries: { include: { deployedBy: { select: { id: true, fullName: true } } }, orderBy: { createdAt: 'asc' } },
};

@Injectable()
export class ChangesService {
  constructor(private db: DatabaseService) {}

  async create(dto: CreateChangeRequestDto, requesterId: string) {
    const ticketNumber = await this.generateTicketNumber();
    return this.db.changeRequest.create({
      data: {
        ticketNumber,
        requesterId,
        status: 'proposed',
        title: dto.title,
        description: dto.description,
        categoryId: dto.categoryId,
        priority: dto.priority,
        changeType: dto.changeType,
        implementationPlan: dto.implementationPlan,
        rollbackPlan: dto.rollbackPlan,
        impactAssessment: dto.impactAssessment,
        isEmergency: dto.isEmergency ?? false,
        scheduledMaintenanceWindow: dto.scheduledMaintenanceWindow ? new Date(dto.scheduledMaintenanceWindow) : undefined,
        maintenanceDurationMinutes: dto.maintenanceDurationMinutes,
      },
      include,
    });
  }

  async findAll(filters: FilterChangesDto) {
    const { page = 1, limit = 20, status, priority, changeType } = filters;
    const where: Prisma.ChangeRequestWhereInput = {
      deletedAt: null,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(changeType && { changeType }),
    };
    const [data, total] = await Promise.all([
      this.db.changeRequest.findMany({ where, include, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.db.changeRequest.count({ where }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const change = await this.db.changeRequest.findFirst({ where: { id, deletedAt: null }, include });
    if (!change) throw new NotFoundException(`ChangeRequest ${id} not found`);
    return change;
  }

  async update(id: string, dto: UpdateChangeRequestDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.implementationDate) data.implementationDate = new Date(dto.implementationDate);
    if (dto.scheduledMaintenanceWindow) data.scheduledMaintenanceWindow = new Date(dto.scheduledMaintenanceWindow);
    if (dto.status === 'closed') data.implementationDate = data.implementationDate ?? new Date();
    return this.db.changeRequest.update({ where: { id }, data, include });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.changeRequest.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getStats() {
    const statuses = ['proposed', 'authorized', 'scheduled', 'implemented', 'reviewed', 'closed'];
    const counts = await Promise.all(
      statuses.map((s) => this.db.changeRequest.count({ where: { deletedAt: null, status: s } })),
    );
    return Object.fromEntries(statuses.map((s, i) => [s, counts[i]]));
  }

  private async generateTicketNumber(): Promise<string> {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await this.db.changeRequest.count();
    return `RFC-${ym}-${String(count + 1).padStart(5, '0')}`;
  }
}
