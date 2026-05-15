import { cn } from '../../utils/cn';
import { PRIORITY_LABELS } from '../../utils/constants';

const colors: Record<string, string> = {
  critical: 'bg-red-100 text-red-800 border border-red-200',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold', colors[priority] ?? 'bg-gray-100 text-gray-600')}>
      {PRIORITY_LABELS[priority] ?? priority}
    </span>
  );
}
