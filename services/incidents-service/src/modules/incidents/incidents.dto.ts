import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { IncidentPriority } from '../../common/enums/incident-priority.enum';
import { IncidentStatus } from '../../common/enums/incident-status.enum';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Servidor caído en producción' })
  @IsString() title: string;

  @ApiProperty()
  @IsString() description: string;

  @ApiProperty()
  @IsUUID() categoryId: string;

  @ApiProperty({ enum: IncidentPriority })
  @IsEnum(IncidentPriority) priority: IncidentPriority;

  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() slaId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assignedToTeamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() estimatedCompletionDate?: string;
}

export class UpdateIncidentDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: IncidentStatus }) @IsOptional() @IsEnum(IncidentStatus) status?: IncidentStatus;
  @ApiPropertyOptional({ enum: IncidentPriority }) @IsOptional() @IsEnum(IncidentPriority) priority?: IncidentPriority;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() impact?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assignedToUserId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assignedToTeamId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() resolutionDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() estimatedCompletionDate?: string;
}

export class FilterIncidentsDto {
  @ApiPropertyOptional({ enum: IncidentStatus }) @IsOptional() @IsEnum(IncidentStatus) status?: string;
  @ApiPropertyOptional({ enum: IncidentPriority }) @IsOptional() @IsEnum(IncidentPriority) priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() categoryId?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() assignedToUserId?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}

export class AddCommentDto {
  @ApiProperty() @IsString() content: string;
  @ApiPropertyOptional({ default: false }) @IsOptional() isInternal?: boolean = false;
}
