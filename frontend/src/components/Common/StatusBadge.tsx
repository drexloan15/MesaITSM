import { cn } from '../../utils/cn';
import { STATUS_LABELS } from '../../utils/constants';

const colors: Record<string, string> = {
  aceptada: 'bg-blue-100 text-blue-800',
  autorizada: 'bg-indigo-100 text-indigo-800',
  planificada: 'bg-yellow-100 text-yellow-800',
  cerrada: 'bg-green-100 text-green-800',
  caducada: 'bg-slate-100 text-slate-600',
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colors[status] ?? 'bg-gray-100 text-gray-600')}>
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
