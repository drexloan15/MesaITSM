import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CreateProblemDto, FilterProblemsDto, UpdateProblemDto } from './problems.dto';
import { ProblemsService } from './problems.service';

@ApiTags('problems')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('problems')
export class ProblemsController {
  constructor(private problemsService: ProblemsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo problema' })
  create(@Body() dto: CreateProblemDto, @CurrentUser() user: any) {
    return this.problemsService.create(dto, user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de problemas' })
  getStats() {
    return this.problemsService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'Listar problemas con filtros' })
  findAll(@Query() filters: FilterProblemsDto) {
    return this.problemsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener problema por ID' })
  findOne(@Param('id') id: string) {
    return this.problemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar problema (causa raíz, solución, estado)' })
  update(@Param('id') id: string, @Body() dto: UpdateProblemDto) {
    return this.problemsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete problema' })
  remove(@Param('id') id: string) {
    return this.problemsService.remove(id);
  }
}
