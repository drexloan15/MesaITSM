import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, pages, total, limit, onChange }: Props) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 bg-white">
      <p className="text-sm text-slate-600">
        Mostrando <span className="font-medium">{from}–{to}</span> de{' '}
        <span className="font-medium">{total}</span> resultados
      </p>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className={cn('p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed')}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={cn(
                'px-3 py-1 text-sm rounded',
                p === page ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 text-slate-700',
              )}
            >
              {p}
            </button>
          );
        })}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
