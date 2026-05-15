import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { incidentService, IncidentFilters } from '../services/incident.service';
import { CreateIncidentData } from '../types/incident.types';

export function useIncidents(filters: IncidentFilters = {}) {
  return useQuery({
    queryKey: ['incidents', filters],
    queryFn: () => incidentService.getAll(filters),
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => incidentService.getById(id),
    enabled: !!id,
  });
}

export function useIncidentStats() {
  return useQuery({
    queryKey: ['incidents', 'stats'],
    queryFn: () => incidentService.getStats(),
    refetchInterval: 60_000,
  });
}

export function useCategories(type?: string) {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: () => incidentService.getCategories(type),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateIncidentData) => incidentService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }),
  });
}

export function useUpdateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => incidentService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['incidents'] });
      qc.invalidateQueries({ queryKey: ['incidents', id] });
    },
  });
}
