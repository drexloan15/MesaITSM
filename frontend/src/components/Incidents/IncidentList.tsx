import { AlertTriangle } from 'lucide-react';
import { Incident } from '../../types/incident.types';
import { formatDate, isOverdue } from '../../utils/date-format';
import { cn } from '../../utils/cn';
import PriorityBadge from '../Common/PriorityBadge';
import StatusBadge from '../Common/StatusBadge';
import EmptyState from '../Common/EmptyState';

interface Props {
  incidents: Incident[];
  onSelect: (incident: Incident) => void;
}

export default function IncidentList({ incidents, onSelect }: Props) {
  if (incidents.length === 0) {
    return <EmptyState title="No hay incidentes" description="Crea el primer incidente con el botón de arriba." />;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Prioridad</th>
            <th className="px-4 py-3">Categoría</th>
            <th className="px-4 py-3">Solicitante</th>
            <th className="px-4 py-3">Vence</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {incidents.map((inc) => {
            const overdue = isOverdue(inc.dueDate) && inc.status !== 'cerrada';
            return (
              <tr
                key={inc.id}
                onClick={() => onSelect(inc)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                  {inc.ticketNumber}
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="font-medium text-slate-800 truncate">{inc.title}</p>
                  {inc.isSlaBreached && (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-0.5">
                      <AlertTriangle className="h-3 w-3" /> SLA incumplido
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusBadge status={inc.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <PriorityBadge priority={inc.priority} />
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {inc.category?.name}
                </td>
                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                  {inc.requester?.fullName}
                </td>
                <td className={cn('px-4 py-3 whitespace-nowrap text-xs', overdue ? 'text-red-600 font-semibold' : 'text-slate-500')}>
                  {formatDate(inc.dueDate)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
