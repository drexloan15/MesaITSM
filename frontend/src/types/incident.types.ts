export type IncidentStatus = 'aceptada' | 'caducada' | 'autorizada' | 'planificada' | 'cerrada';
export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Incident {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: IncidentPriority;
  severity?: string;
  impact?: string;
  category: { id: string; name: string; type: string };
  sla?: { id: string; name: string; resolutionTimeHours: number };
  requester: { id: string; email: string; username: string; fullName: string };
  assignedToUser?: { id: string; fullName: string; username: string };
  assignedToTeam?: { id: string; name: string };
  dueDate: string;
  isSlaBreached: boolean;
  slaBreachAt?: string;
  resolutionDescription?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments?: IncidentComment[];
}

export interface IncidentComment {
  id: string;
  content: string;
  isInternal: boolean;
  userId: string;
  user: { id: string; fullName: string; username: string };
  createdAt: string;
}

export interface CreateIncidentData {
  title: string;
  description: string;
  categoryId: string;
  priority: IncidentPriority;
  severity?: string;
  impact?: string;
  slaId?: string;
  assignedToUserId?: string;
  assignedToTeamId?: string;
}

export interface IncidentStats {
  total: number;
  aceptadas: number;
  autorizadas: number;
  planificadas: number;
  cerradas: number;
  breached: number;
}

export interface Category {
  id: string;
  name: string;
  type: string;
  description?: string;
}
