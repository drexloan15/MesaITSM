import { Outlet, useLocation } from 'react-router-dom';
import { useUiStore } from '../../store/uiStore';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/incidents': 'Incidentes',
  '/problems': 'Problemas',
  '/changes': 'Cambios (RFC)',
  '/knowledge-base': 'Base de Conocimiento',
  '/users': 'Usuarios',
  '/admin': 'Administración',
};

export default function Layout() {
  const location = useLocation();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const title = pageTitles[location.pathname] ?? 'ITSM';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {sidebarOpen && <Sidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
