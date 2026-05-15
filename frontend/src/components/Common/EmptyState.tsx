import { InboxIcon } from 'lucide-react';

interface Props {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title = 'Sin resultados', description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <InboxIcon className="h-12 w-12 text-slate-300 mb-4" />
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
