import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { SlaEngine } from './sla.engine';

@Processor('incidents')
export class IncidentsQueue {
  private readonly logger = new Logger(IncidentsQueue.name);
  constructor(private slaEngine: SlaEngine) {}

  @Process('incident.created')
  async handleCreated(job: Job<{ incidentId: string; ticketNumber: string }>) {
    this.logger.log(`[incident.created] ${job.data.ticketNumber}`);
  }

  @Process('incident.assigned')
  async handleAssigned(job: Job<{ incidentId: string; assignedTo: string }>) {
    this.logger.log(`[incident.assigned] ${job.data.incidentId}`);
  }

  @Process('sla.check')
  async handleSlaCheck(_job: Job) {
    await this.slaEngine.checkBreaches();
  }
}
