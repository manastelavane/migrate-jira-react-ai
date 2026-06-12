import type { JIssue } from './issue';
import type { JUser } from './user';

export enum ProjectCategory {
  SOFTWARE = 'Software',
  MARKETING = 'Marketing',
  BUSINESS = 'Business',
}

export interface JProject {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
  issues: JIssue[];
  users: JUser[];
}
