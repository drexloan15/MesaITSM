import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from '../../config/database';
import { JwtStrategy, JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ChangesController } from './changes.controller';
import { ChangesService } from './changes.service';
import { DeliveriesService } from './deliveries.service';

@Module({
  imports: [PassportModule],
  controllers: [ChangesController],
  providers: [DatabaseService, ChangesService, DeliveriesService, JwtStrategy, JwtAuthGuard],
})
export class ChangesModule {}
