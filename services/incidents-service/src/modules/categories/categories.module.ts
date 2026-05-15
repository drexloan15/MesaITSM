import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DatabaseService } from '../../config/database';
import { JwtStrategy, JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CategoriesController } from './categories.controller';

@Module({
  imports: [PassportModule],
  controllers: [CategoriesController],
  providers: [DatabaseService, JwtStrategy, JwtAuthGuard],
})
export class CategoriesModule {}
