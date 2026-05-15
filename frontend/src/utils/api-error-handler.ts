import { AxiosError } from 'axios';

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    if (typeof data?.message === 'string') return data.message;
    if (Array.isArray(data?.message)) return data.message.join(', ');
    if (data?.error) return data.error;
  }
  if (error instanceof Error) return error.message;
  return 'Ha ocurrido un error inesperado';
}
