import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { ChangesService } from './changes.service';
import { CreateChangeRequestDto, CreateDeliveryDto, FilterChangesDto, UpdateChangeRequestDto, UpdateDeliveryDto } from './changes.dto';
import { DeliveriesService } from './deliveries.service';

@ApiTags('changes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('changes')
export class ChangesController {
  constructor(
    private changesService: ChangesService,
    private deliveriesService: DeliveriesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear RFC (Request For Change)' })
  create(@Body() dto: CreateChangeRequestDto, @CurrentUser() user: any) {
    return this.changesService.create(dto, user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas de cambios por estado' })
  getStats() { return this.changesService.getStats(); }

  @Get()
  @ApiOperation({ summary: 'Listar RFCs con filtros' })
  findAll(@Query() filters: FilterChangesDto) { return this.changesService.findAll(filters); }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener RFC por ID con entregas' })
  findOne(@Param('id') id: string) { return this.changesService.findOne(id); }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar RFC (estado, plan, aprobación)' })
  update(@Param('id') id: string, @Body() dto: UpdateChangeRequestDto) { return this.changesService.update(id, dto); }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete RFC' })
  remove(@Param('id') id: string) { return this.changesService.remove(id); }

  // ── Deliveries ──────────────────────────────────────────────────────────────

  @Post(':id/deliveries')
  @ApiOperation({ summary: 'Agregar entrega a un RFC' })
  createDelivery(@Param('id') id: string, @Body() dto: CreateDeliveryDto) {
    return this.deliveriesService.create(id, dto);
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'Listar entregas de un RFC' })
  getDeliveries(@Param('id') id: string) { return this.deliveriesService.findByChange(id); }

  @Patch('deliveries/:deliveryId')
  @ApiOperation({ summary: 'Actualizar estado de una entrega' })
  updateDelivery(@Param('deliveryId') id: string, @Body() dto: UpdateDeliveryDto) {
    return this.deliveriesService.update(id, dto);
  }
}
