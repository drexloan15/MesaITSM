import { Bell, ChevronDown, LogOut, Menu, User } from 'lucide-react';
import { useState } from 'react';
import { useCurrentUser, useLogout } from '../../hooks/useAuth';
import { useUiStore } from '../../store/uiStore';

export default function TopBar({ title }: { title: string }) {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const toggle = useUiStore((s) => s.toggleSidebar);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="p-1.5 rounded hover:bg-slate-100 text-slate-500">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 relative">
          <Bell className="h-5 w-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100"
          >
            <div className="h-7 w-7 rounded-full bg-brand-500 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">
              {user?.fullName ?? 'Usuario'}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
