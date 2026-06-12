// Shared config values and env mappings
export const APP_NAME = 'Jira Clone';

export const ROUTES = {
  HOME: '/',
  BOARD: '/project/board',
  SETTINGS: '/project/settings',
  ISSUE: (id: string) => `/project/issue/${id}`,
} as const;
