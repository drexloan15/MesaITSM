import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ChangeStatus } from '../../common/enums/change-status.enum';

export enum ChangeType { STANDARD = 'standard', NORMAL = 'normal', EMERGENCY = 'emergency' }
export enum ChangePriority { CRITICAL = 'critical', HIGH = 'high', MEDIUM = 'medium', LOW = 'low' }

export class CreateChangeRequestDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsUUID() categoryId: string;
  @ApiProperty({ enum: ChangePriority }) @IsEnum(ChangePriority) priority: ChangePriority;
  @ApiProperty({ enum: ChangeType }) @IsEnum(ChangeType) changeType: ChangeType;
  @ApiProperty() @IsString() implementationPlan: string;

  @ApiPropertyOptional() @IsOptional() @IsString() rollbackPlan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impactAssessment?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledMaintenanceWindow?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) maintenanceDurationMinutes?: number;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isEmergency?: boolean;
}

export class UpdateChangeRequestDto {
  @ApiPropertyOptional({ enum: ChangeStatus }) @IsOptional() @IsEnum(ChangeStatus) status?: ChangeStatus;
  @ApiPropertyOptional({ enum: ChangePriority }) @IsOptional() @IsEnum(ChangePriority) priority?: ChangePriority;
  @ApiPropertyOptional() @IsOptional() @IsString() implementationPlan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rollbackPlan?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impactAssessment?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() managerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() implementationDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledMaintenanceWindow?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() maintenanceDurationMinutes?: number;
}

export class CreateDeliveryDto {
  @ApiProperty() @IsString() title: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledDate?: string;
}

export class UpdateDeliveryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() completedDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() deployedById?: string;
}

export class FilterChangesDto {
  @ApiPropertyOptional({ enum: ChangeStatus }) @IsOptional() @IsEnum(ChangeStatus) status?: string;
  @ApiPropertyOptional({ enum: ChangePriority }) @IsOptional() @IsEnum(ChangePriority) priority?: string;
  @ApiPropertyOptional({ enum: ChangeType }) @IsOptional() @IsEnum(ChangeType) changeType?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
