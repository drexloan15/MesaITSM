import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { DatabaseService } from '../../config/database';

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private db: DatabaseService) {}

  @Get()
  @ApiOperation({ summary: 'Listar categorías activas' })
  findAll(@Query('type') type?: string) {
    return this.db.category.findMany({
      where: { isActive: true, ...(type && { type }) },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
