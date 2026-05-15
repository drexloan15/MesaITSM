import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from '../../config/database';
import { JwtStrategy, JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ProblemsController } from './problems.controller';
import { ProblemsService } from './problems.service';

@Module({
  imports: [PassportModule],
  controllers: [ProblemsController],
  providers: [DatabaseService, ProblemsService, JwtStrategy, JwtAuthGuard],
})
export class ProblemsModule {}
