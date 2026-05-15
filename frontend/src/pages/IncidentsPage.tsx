import { Plus } from 'lucide-react';
import { useState } from 'react';
import IncidentDetail from '../components/Incidents/IncidentDetail';
import IncidentFilters from '../components/Incidents/IncidentFilters';
import IncidentForm from '../components/Incidents/IncidentForm';
import IncidentList from '../components/Incidents/IncidentList';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal';
import Pagination from '../components/Common/Pagination';
import { useIncident, useIncidents } from '../hooks/useIncidents';
import { Incident } from '../types/incident.types';

export default function IncidentsPage() {
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading } = useIncidents({ ...filters, page, limit: 15 });
  const { data: selectedIncident } = useIncident(selectedId ?? '');

  const handleSelect = (inc: Incident) => setSelectedId(inc.id);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <IncidentFilters
          filters={filters}
          onChange={(f) => { setFilters(f); setPage(1); }}
        />
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg transition-colors flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          Nuevo Incidente
        </button>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {isLoading ? (
          <LoadingSpinner className="h-48" />
        ) : (
          <>
            <IncidentList incidents={data?.data ?? []} onSelect={handleSelect} />
            {data && data.pages > 1 && (
              <Pagination
                page={page}
                pages={data.pages}
                total={data.total}
                limit={15}
                onChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Nuevo Incidente" size="lg">
        <IncidentForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!selectedId}
        onClose={() => setSelectedId(null)}
        title="Detalle del Incidente"
        size="lg"
      >
        {selectedIncident ? (
          <IncidentDetail incident={selectedIncident} />
        ) : (
          <LoadingSpinner className="h-24" />
        )}
      </Modal>
    </div>
  );
}
