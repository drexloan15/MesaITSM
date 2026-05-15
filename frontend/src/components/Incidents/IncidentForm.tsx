import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCategories, useCreateIncident } from '../../hooks/useIncidents';
import { CreateIncidentData } from '../../types/incident.types';
import { PRIORITY_OPTIONS } from '../../utils/constants';
import { getErrorMessage } from '../../utils/api-error-handler';

const schema = z.object({
  title: z.string().min(5, 'Mínimo 5 caracteres'),
  description: z.string().min(10, 'Mínimo 10 caracteres'),
  categoryId: z.string().uuid('Selecciona una categoría'),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  severity: z.string().optional(),
  impact: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

export default function IncidentForm({ onSuccess }: Props) {
  const { data: categories = [] } = useCategories('incident');
  const create = useCreateIncident();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium' },
  });

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data as CreateIncidentData);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Título *</label>
        <input
          {...register('title')}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Descripción breve del incidente"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción *</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          placeholder="Detalla el problema, pasos para reproducirlo y el impacto..."
        />
        {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoría *</label>
          <select {...register('categoryId')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Seleccionar...</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.categoryId && <p className="text-xs text-red-600 mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Prioridad *</label>
          <select {...register('priority')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Severidad</label>
          <select {...register('severity')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Sin especificar</option>
            {PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Impacto</label>
          <select {...register('impact')} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="">Sin especificar</option>
            <option value="high">Alto</option>
            <option value="medium">Medio</option>
            <option value="low">Bajo</option>
          </select>
        </div>
      </div>

      {create.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {getErrorMessage(create.error)}
        </p>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={create.isPending}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium rounded-lg disabled:opacity-60 transition-colors"
        >
          {create.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Crear Incidente
        </button>
      </div>
    </form>
  );
}
