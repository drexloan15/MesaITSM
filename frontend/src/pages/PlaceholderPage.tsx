import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-80 text-center">
      <Construction className="h-12 w-12 text-slate-300 mb-4" />
      <h2 className="text-lg font-semibold text-slate-700">{title}</h2>
      <p className="text-sm text-slate-500 mt-1">Este módulo estará disponible en la siguiente fase.</p>
    </div>
  );
}
