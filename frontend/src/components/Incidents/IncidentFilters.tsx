import { Search, X } from 'lucide-react';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';

interface Filters {
  status: string;
  priority: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function IncidentFilters({ filters, onChange }: Props) {
  const set = (key: keyof Filters, val: string) => onChange({ ...filters, [key]: val });
  const hasFilters = filters.status || filters.priority;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <select
        value={filters.status}
        onChange={(e) => set('status', e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Todos los estados</option>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <select
        value={filters.priority}
        onChange={(e) => set('priority', e.target.value)}
        className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">Todas las prioridades</option>
        {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      {hasFilters && (
        <button
          onClick={() => onChange({ status: '', priority: '' })}
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 px-2 py-2"
        >
          <X className="h-3.5 w-3.5" /> Limpiar
        </button>
      )}
    </div>
  );
}
