import type { JProject } from '../interfaces/project';
import type { JIssue, JComment } from '../interfaces/issue';
import type { JUser } from '../interfaces/user';
import { IssueType, IssueStatus, IssuePriority } from '../interfaces/issue';
import { ProjectCategory } from '../interfaces/project';

// Raw shapes coming from assets/data/project.json
interface RawUser {
  id: string;
  name: string;
  avatarUrl: string;
  projectId?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface RawIssue {
  id: string;
  title: string;
  type: string;
  status: string;
  priority: string;
  listPosition: number;
  description: string;
  estimate?: number | null;
  timeSpent?: number | null;
  timeRemaining?: number | null;
  createdAt: string;
  updatedAt: string;
  reporterId: string;
  userIds: string[];
  comments?: RawComment[];
  projectId?: string;
}

interface RawComment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  issueId: string;
  userId: string;
}

interface RawProject {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt?: string;
  // Angular source typo — support both
  updateAt?: string;
  users: RawUser[];
  issues: RawIssue[];
}

function adaptUser(raw: RawUser): JUser {
  return {
    id: raw.id,
    name: raw.name,
    avatarUrl: raw.avatarUrl,
    email: raw.email ?? '',
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
    projectId: raw.projectId,
  };
}

function adaptComment(raw: RawComment): JComment {
  return {
    id: raw.id,
    body: raw.body,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    issueId: raw.issueId,
    userId: raw.userId,
  };
}

function adaptIssue(raw: RawIssue, projectId: string): JIssue {
  return {
    id: raw.id,
    title: raw.title,
    type: (raw.type as IssueType) ?? IssueType.TASK,
    status: (raw.status as IssueStatus) ?? IssueStatus.BACKLOG,
    priority: (raw.priority as IssuePriority) ?? IssuePriority.MEDIUM,
    listPosition: raw.listPosition ?? 0,
    description: raw.description ?? '',
    estimate: raw.estimate ?? null,
    timeSpent: raw.timeSpent ?? null,
    timeRemaining: raw.timeRemaining ?? null,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    reporterId: raw.reporterId,
    userIds: raw.userIds ?? [],
    comments: (raw.comments ?? []).map(adaptComment),
    projectId: raw.projectId ?? projectId,
  };
}

export function adaptProject(raw: RawProject): JProject {
  return {
    id: raw.id,
    name: raw.name,
    url: raw.url,
    description: raw.description,
    category: (raw.category as ProjectCategory) ?? ProjectCategory.SOFTWARE,
    createdAt: raw.createdAt,
    // Angular source has typo `updateAt` — normalize to `updatedAt`
    updatedAt: raw.updatedAt ?? raw.updateAt ?? new Date().toISOString(),
    users: raw.users.map(adaptUser),
    issues: raw.issues.map((issue) => adaptIssue(issue, raw.id)),
  };
}
