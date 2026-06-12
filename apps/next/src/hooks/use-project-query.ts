'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUserAsync, getIssueByIdAsync, getProjectAsync } from '@/services/project.service';

export function useProjectQuery() {
  return useQuery({
    queryKey: ['project'],
    queryFn: getProjectAsync,
  });
}

export function useCurrentUserQuery() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUserAsync,
  });
}

export function useIssueQuery(issueId: string) {
  return useQuery({
    queryKey: ['issue', issueId],
    queryFn: () => getIssueByIdAsync(issueId),
  });
}
