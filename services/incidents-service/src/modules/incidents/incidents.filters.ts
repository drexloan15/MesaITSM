import { Prisma } from '@prisma/client';
import { FilterIncidentsDto } from './incidents.dto';

export function buildIncidentWhereClause(filters: FilterIncidentsDto): Prisma.IncidentWhereInput {
  const where: Prisma.IncidentWhereInput = { deletedAt: null };
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.assignedToUserId) where.assignedToUserId = filters.assignedToUserId;
  return where;
}

export const incidentIncludes: Prisma.IncidentInclude = {
  category: true,
  sla: true,
  requester: { select: { id: true, email: true, username: true, fullName: true } },
  assignedToUser: { select: { id: true, email: true, username: true, fullName: true } },
  assignedToTeam: { select: { id: true, name: true } },
};
