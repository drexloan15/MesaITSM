export const STATUS_LABELS: Record<string, string> = {
  aceptada: 'Aceptada',
  caducada: 'Caducada',
  autorizada: 'Autorizada',
  planificada: 'Planificada',
  cerrada: 'Cerrada',
};

export const PRIORITY_LABELS: Record<string, string> = {
  critical: 'Crítica',
  high: 'Alta',
  medium: 'Media',
  low: 'Baja',
};

export const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Crítica' },
  { value: 'high', label: 'Alta' },
  { value: 'medium', label: 'Media' },
  { value: 'low', label: 'Baja' },
];

export const STATUS_OPTIONS = [
  { value: 'aceptada', label: 'Aceptada' },
  { value: 'autorizada', label: 'Autorizada' },
  { value: 'planificada', label: 'Planificada' },
  { value: 'cerrada', label: 'Cerrada' },
  { value: 'caducada', label: 'Caducada' },
];
