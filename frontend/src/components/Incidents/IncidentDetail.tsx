import { AlertTriangle, Calendar, Tag, User } from 'lucide-react';
import { Incident } from '../../types/incident.types';
import { formatDate, formatRelative } from '../../utils/date-format';
import PriorityBadge from '../Common/PriorityBadge';
import StatusBadge from '../Common/StatusBadge';

export default function IncidentDetail({ incident }: { incident: Incident }) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-slate-500 mb-1">{incident.ticketNumber}</p>
          <h3 className="text-base font-semibold text-slate-800">{incident.title}</h3>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <StatusBadge status={incident.status} />
          <PriorityBadge priority={incident.priority} />
        </div>
      </div>

      {/* SLA breach warning */}
      {incident.isSlaBreached && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          SLA incumplido — {incident.slaBreachAt && formatDate(incident.slaBreachAt)}
        </div>
      )}

      {/* Description */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Descripción</p>
        <p className="text-sm text-slate-700 leading-relaxed">{incident.description}</p>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-2">
          <User className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Solicitante</p>
            <p className="font-medium text-slate-700">{incident.requester?.fullName}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Tag className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Categoría</p>
            <p className="font-medium text-slate-700">{incident.category?.name}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Fecha límite</p>
            <p className="font-medium text-slate-700">{formatDate(incident.dueDate)}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500">Creado</p>
            <p className="font-medium text-slate-700">{formatRelative(incident.createdAt)}</p>
          </div>
        </div>
        {incident.assignedToUser && (
          <div className="flex items-start gap-2">
            <User className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-500">Asignado a</p>
              <p className="font-medium text-slate-700">{incident.assignedToUser.fullName}</p>
            </div>
          </div>
        )}
      </div>

      {/* Comments */}
      {incident.comments && incident.comments.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
            Comentarios ({incident.comments.length})
          </p>
          <div className="space-y-2">
            {incident.comments.map((c) => (
              <div key={c.id} className={`rounded-lg px-3 py-2 text-sm ${c.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-slate-50'}`}>
                <p className="text-xs text-slate-500 mb-0.5">
                  {c.user.fullName} · {formatRelative(c.createdAt)}
                  {c.isInternal && <span className="ml-2 text-yellow-700 font-medium">Interno</span>}
                </p>
                <p className="text-slate-700">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
