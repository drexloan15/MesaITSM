import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../../config/database';

@Injectable()
export class SlaEngine {
  private readonly logger = new Logger(SlaEngine.name);

  constructor(private db: DatabaseService) {}

  async calculateDueDate(slaId: string, createdAt: Date = new Date()): Promise<Date> {
    const sla = await this.db.sla.findUnique({ where: { id: slaId } });
    if (!sla) return new Date(createdAt.getTime() + 24 * 3600 * 1000);
    const dueDate = new Date(createdAt);
    dueDate.setHours(dueDate.getHours() + sla.resolutionTimeHours);
    return dueDate;
  }

  async checkBreaches(): Promise<number> {
    const now = new Date();
    const breached = await this.db.incident.findMany({
      where: { isSlaBreached: false, deletedAt: null, status: { notIn: ['cerrada', 'caducada'] }, dueDate: { lte: now } },
      select: { id: true, ticketNumber: true },
    });
    if (breached.length === 0) return 0;
    await this.db.incident.updateMany({
      where: { id: { in: breached.map((i) => i.id) } },
      data: { isSlaBreached: true, slaBreachAt: now },
    });
    this.logger.warn(`SLA breached for ${breached.length} incidents`);
    return breached.length;
  }
}
