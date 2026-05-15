import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { DatabaseService } from '../../config/database';
import { PaginatedResponse } from '../../common/interfaces/paginated.interface';
import { CreateIncidentDto, UpdateIncidentDto, FilterIncidentsDto, AddCommentDto } from './incidents.dto';
import { buildIncidentWhereClause, incidentIncludes } from './incidents.filters';
import { SlaEngine } from './sla.engine';

@Injectable()
export class IncidentsService {
  constructor(
    private db: DatabaseService,
    private slaEngine: SlaEngine,
    @InjectQueue('incidents') private queue: Queue,
  ) {}

  async create(dto: CreateIncidentDto, requesterId: string) {
    const ticketNumber = await this.generateTicketNumber();
    const dueDate = dto.slaId
      ? await this.slaEngine.calculateDueDate(dto.slaId)
      : new Date(Date.now() + 24 * 3600 * 1000);

    const incident = await this.db.incident.create({
      data: {
        ticketNumber, requesterId, dueDate, status: 'aceptada',
        title: dto.title, description: dto.description, categoryId: dto.categoryId,
        priority: dto.priority, severity: dto.severity, impact: dto.impact,
        slaId: dto.slaId, assignedToUserId: dto.assignedToUserId,
        assignedToTeamId: dto.assignedToTeamId,
        estimatedCompletionDate: dto.estimatedCompletionDate ? new Date(dto.estimatedCompletionDate) : undefined,
      },
      include: incidentIncludes,
    });

    await this.queue.add('incident.created', { incidentId: incident.id, ticketNumber: incident.ticketNumber });
    return incident;
  }

  async findAll(filters: FilterIncidentsDto): Promise<PaginatedResponse<any>> {
    const { page = 1, limit = 20 } = filters;
    const where = buildIncidentWhereClause(filters);
    const [data, total] = await Promise.all([
      this.db.incident.findMany({ where, include: incidentIncludes, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.db.incident.count({ where }),
    ]);
    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const incident = await this.db.incident.findFirst({ where: { id, deletedAt: null }, include: incidentIncludes });
    if (!incident) throw new NotFoundException(`Incident ${id} not found`);
    const comments = await this.db.comment.findMany({
      where: { resourceType: 'incident', resourceId: id, deletedAt: null },
      include: { user: { select: { id: true, fullName: true, username: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return { ...incident, comments };
  }

  async getStats() {
    const [total, aceptadas, autorizadas, planificadas, cerradas, breached] = await Promise.all([
      this.db.incident.count({ where: { deletedAt: null } }),
      this.db.incident.count({ where: { deletedAt: null, status: 'aceptada' } }),
      this.db.incident.count({ where: { deletedAt: null, status: 'autorizada' } }),
      this.db.incident.count({ where: { deletedAt: null, status: 'planificada' } }),
      this.db.incident.count({ where: { deletedAt: null, status: 'cerrada' } }),
      this.db.incident.count({ where: { deletedAt: null, isSlaBreached: true } }),
    ]);
    return { total, aceptadas, autorizadas, planificadas, cerradas, breached };
  }

  async update(id: string, dto: UpdateIncidentDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.estimatedCompletionDate) data.estimatedCompletionDate = new Date(dto.estimatedCompletionDate);
    if (dto.status === 'cerrada') { data.closedAt = new Date(); data.resolvedAt = data.resolvedAt ?? new Date(); }
    if (dto.assignedToUserId) await this.queue.add('incident.assigned', { incidentId: id, assignedTo: dto.assignedToUserId });
    return this.db.incident.update({ where: { id }, data, include: incidentIncludes });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.db.incident.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async addComment(incidentId: string, dto: AddCommentDto, userId: string) {
    await this.findOne(incidentId);
    return this.db.comment.create({
      data: { content: dto.content, isInternal: dto.isInternal ?? false, resourceType: 'incident', resourceId: incidentId, userId },
      include: { user: { select: { id: true, fullName: true, username: true } } },
    });
  }

  private async generateTicketNumber(): Promise<string> {
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const count = await this.db.incident.count();
    return `INC-${ym}-${String(count + 1).padStart(5, '0')}`;
  }
}
