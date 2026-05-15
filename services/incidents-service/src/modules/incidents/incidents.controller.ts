import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IncidentsService } from './incidents.service';
import { AddCommentDto, CreateIncidentDto, FilterIncidentsDto, UpdateIncidentDto } from './incidents.dto';

@ApiTags('incidents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo incidente' })
  create(@Body() dto: CreateIncidentDto, @CurrentUser() user: any) {
    return this.incidentsService.create(dto, user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de incidentes' })
  getStats() { return this.incidentsService.getStats(); }

  @Get()
  @ApiOperation({ summary: 'Listar incidentes con filtros' })
  findAll(@Query() filters: FilterIncidentsDto) { return this.incidentsService.findAll(filters); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener incidente por ID' })
  findOne(@Param('id') id: string) { return this.incidentsService.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar incidente' })
  update(@Param('id') id: string, @Body() dto: UpdateIncidentDto) { return this.incidentsService.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete incidente' })
  remove(@Param('id') id: string) { return this.incidentsService.remove(id); }

  @Post(':id/comments')
  @ApiOperation({ summary: 'Agregar comentario' })
  addComment(@Param('id') id: string, @Body() dto: AddCommentDto, @CurrentUser() user: any) {
    return this.incidentsService.addComment(id, dto, user.id);
  }
}
