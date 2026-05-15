import { format, formatDistanceToNow, isPast } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatDate = (date: string | Date) =>
  format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });

export const formatRelative = (date: string | Date) =>
  formatDistanceToNow(new Date(date), { addSuffix: true, locale: es });

export const isOverdue = (date: string | Date) => isPast(new Date(date));
