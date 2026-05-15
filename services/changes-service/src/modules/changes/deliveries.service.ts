import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../config/database';
import { CreateDeliveryDto, UpdateDeliveryDto } from './changes.dto';

@Injectable()
export class DeliveriesService {
  constructor(private db: DatabaseService) {}

  async create(changeRequestId: string, dto: CreateDeliveryDto) {
    await this.ensureChangeExists(changeRequestId);
    return this.db.delivery.create({
      data: {
        changeRequestId,
        title: dto.title,
        description: dto.description,
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : undefined,
        status: 'scheduled',
      },
      include: { deployedBy: { select: { id: true, fullName: true } } },
    });
  }

  findByChange(changeRequestId: string) {
    return this.db.delivery.findMany({
      where: { changeRequestId },
      include: { deployedBy: { select: { id: true, fullName: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(id: string, dto: UpdateDeliveryDto) {
    const delivery = await this.db.delivery.findUnique({ where: { id } });
    if (!delivery) throw new NotFoundException(`Delivery ${id} not found`);
    return this.db.delivery.update({
      where: { id },
      data: {
        ...dto,
        completedDate: dto.completedDate ? new Date(dto.completedDate) : undefined,
      },
      include: { deployedBy: { select: { id: true, fullName: true } } },
    });
  }

  private async ensureChangeExists(changeRequestId: string) {
    const change = await this.db.changeRequest.findUnique({ where: { id: changeRequestId } });
    if (!change) throw new NotFoundException(`ChangeRequest ${changeRequestId} not found`);
  }
}
