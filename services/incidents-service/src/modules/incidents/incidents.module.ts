import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from '../../config/database';
import { JwtStrategy, JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';
import { IncidentsQueue } from './incidents.queue';
import { SlaEngine } from './sla.engine';

@Module({
  imports: [PassportModule, BullModule.registerQueue({ name: 'incidents' })],
  controllers: [IncidentsController],
  providers: [DatabaseService, IncidentsService, SlaEngine, IncidentsQueue, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [IncidentsService],
})
export class IncidentsModule {}
