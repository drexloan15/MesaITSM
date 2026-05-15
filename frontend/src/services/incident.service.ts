import { ApiResponse, PaginatedResponse } from '../types/api.types';
import { Category, CreateIncidentData, Incident, IncidentStats } from '../types/incident.types';
import { incidentsApi } from './api';

export interface IncidentFilters {
  status?: string;
  priority?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export const incidentService = {
  async getAll(filters: IncidentFilters = {}): Promise<PaginatedResponse<Incident>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.append(k, String(v)); });
    const { data } = await incidentsApi.get<ApiResponse<PaginatedResponse<Incident>>>(`/api/v1/incidents?${params}`);
    return data.data;
  },

  async getById(id: string): Promise<Incident> {
    const { data } = await incidentsApi.get<ApiResponse<Incident>>(`/api/v1/incidents/${id}`);
    return data.data;
  },

  async getStats(): Promise<IncidentStats> {
    const { data } = await incidentsApi.get<ApiResponse<IncidentStats>>('/api/v1/incidents/stats');
    return data.data;
  },

  async create(payload: CreateIncidentData): Promise<Incident> {
    const { data } = await incidentsApi.post<ApiResponse<Incident>>('/api/v1/incidents', payload);
    return data.data;
  },

  async update(id: string, payload: Partial<Incident>): Promise<Incident> {
    const { data } = await incidentsApi.patch<ApiResponse<Incident>>(`/api/v1/incidents/${id}`, payload);
    return data.data;
  },

  async getCategories(type?: string): Promise<Category[]> {
    const { data } = await incidentsApi.get<ApiResponse<Category[]>>(`/api/v1/categories${type ? `?type=${type}` : ''}`);
    return data.data;
  },
};
