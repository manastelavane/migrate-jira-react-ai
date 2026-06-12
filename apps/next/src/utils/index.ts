export { formatDate, timeAgo } from '@jira/shared';

export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}...` : str;
}
