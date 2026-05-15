import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { ProblemPriority } from '../../common/enums/problem-priority.enum';
import { ProblemStatus } from '../../common/enums/problem-status.enum';

export class CreateProblemDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsUUID() categoryId: string;
  @ApiProperty({ enum: ProblemPriority }) @IsEnum(ProblemPriority) priority: ProblemPriority;

  @ApiPropertyOptional() @IsOptional() @IsString() workaround?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() managerId?: string;
}

export class UpdateProblemDto {
  @ApiPropertyOptional({ enum: ProblemStatus }) @IsOptional() @IsEnum(ProblemStatus) status?: ProblemStatus;
  @ApiPropertyOptional({ enum: ProblemPriority }) @IsOptional() @IsEnum(ProblemPriority) priority?: ProblemPriority;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() investigationNotes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() solutionDescription?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() workaround?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() managerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) relatedIncidents?: number;
}

export class FilterProblemsDto {
  @ApiPropertyOptional({ enum: ProblemStatus }) @IsOptional() @IsEnum(ProblemStatus) status?: string;
  @ApiPropertyOptional({ enum: ProblemPriority }) @IsOptional() @IsEnum(ProblemPriority) priority?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() categoryId?: string;
  @ApiPropertyOptional({ default: 1 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @ApiPropertyOptional({ default: 20 }) @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
