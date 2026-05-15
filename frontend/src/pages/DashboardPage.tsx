import { AlertCircle, AlertTriangle, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIncidentStats, useIncidents } from '../hooks/useIncidents';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import StatusBadge from '../components/Common/StatusBadge';
import PriorityBadge from '../components/Common/PriorityBadge';
import { formatRelative } from '../utils/date-format';
import { cn } from '../utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  bg: string;
}

function StatCard({ label, value, icon: Icon, color, bg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
        <Icon className={cn('h-6 w-6', color)} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useIncidentStats();
  const { data: recent } = useIncidents({ limit: 5, page: 1 });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Resumen de Incidentes
        </h2>
        {statsLoading ? (
          <LoadingSpinner className="h-24" />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total activos" value={stats?.total ?? 0} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="Aceptados" value={stats?.aceptadas ?? 0} icon={Clock} color="text-indigo-600" bg="bg-indigo-50" />
            <StatCard label="Cerrados" value={stats?.cerradas ?? 0} icon={CheckCircle} color="text-green-600" bg="bg-green-50" />
            <StatCard label="SLA incumplido" value={stats?.breached ?? 0} icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
          </div>
        )}
      </div>

      {/* SLA compliance bar */}
      {stats && stats.total > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Cumplimiento SLA</h3>
            <span className="text-sm font-bold text-slate-800">
              {Math.round(((stats.total - stats.breached) / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${((stats.total - stats.breached) / stats.total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-xs text-slate-500">
            <span>{stats.total - stats.breached} dentro del SLA</span>
            <span>{stats.breached} en incumplimiento</span>
          </div>
        </div>
      )}

      {/* Recent incidents */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-slate-400" /> Incidentes recientes
          </h3>
          <Link to="/incidents" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
            Ver todos →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recent?.data.length === 0 && (
            <p className="text-sm text-slate-500 px-5 py-8 text-center">No hay incidentes aún</p>
          )}
          {recent?.data.map((inc) => (
            <Link
              key={inc.id}
              to="/incidents"
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{inc.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {inc.ticketNumber} · {inc.requester?.fullName} · {formatRelative(inc.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <PriorityBadge priority={inc.priority} />
                <StatusBadge status={inc.status} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
