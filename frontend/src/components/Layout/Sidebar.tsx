import {
  AlertCircle, BookOpen, ChevronRight, GitMerge, LayoutDashboard,
  RefreshCw, Settings, Shield, Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const nav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/incidents', icon: AlertCircle, label: 'Incidentes' },
  { to: '/problems', icon: GitMerge, label: 'Problemas' },
  { to: '/changes', icon: RefreshCw, label: 'Cambios' },
  { to: '/knowledge-base', icon: BookOpen, label: 'Conocimiento' },
  { to: '/users', icon: Users, label: 'Usuarios' },
  { to: '/admin', icon: Settings, label: 'Administración' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">COMUTEL</p>
          <p className="text-xs text-slate-400 leading-tight">ITSM Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-400 hover:bg-slate-700 hover:text-white',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">v1.0.0 — Phase 3</p>
      </div>
    </aside>
  );
}
