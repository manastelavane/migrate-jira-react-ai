import type { JIssue, JProject, JUser } from '@jira/shared';
import { adaptProject } from '@jira/shared';
import projectData from '../../../../src/assets/data/project.json';
import authData from '../../../../src/assets/data/auth.json';

let projectState: JProject = adaptProject(projectData as Parameters<typeof adaptProject>[0]);

export function getProject(): JProject {
  return projectState;
}

export function getCurrentUser(): JUser {
  return {
    id: authData.id,
    name: authData.name,
    avatarUrl: authData.avatarUrl,
    createdAt: authData.createdAt,
    updatedAt: authData.updatedAt,
    email: '',
    projectId: getProject().id,
  };
}

export async function getProjectAsync(): Promise<JProject> {
  return getProject();
}

export async function getCurrentUserAsync(): Promise<JUser> {
  return getCurrentUser();
}

export function getIssueById(issueId: string): JIssue | undefined {
  return getProject().issues.find((issue) => issue.id === issueId);
}

export async function getIssueByIdAsync(issueId: string): Promise<JIssue | undefined> {
  return getIssueById(issueId);
}

export function getUsersByIds(userIds: string[]): JUser[] {
  const users = getProject().users;
  return users.filter((user) => userIds.includes(user.id));
}

export function getUserById(userId: string): JUser | undefined {
  return getProject().users.find((user) => user.id === userId);
}

export async function updateProject(partial: Partial<JProject>): Promise<JProject> {
  projectState = {
    ...projectState,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  return projectState;
}

export async function updateIssue(updatedIssue: JIssue): Promise<JProject> {
  const now = new Date().toISOString();
  const issues = projectState.issues.map((issue) =>
    issue.id === updatedIssue.id
      ? {
          ...updatedIssue,
          updatedAt: now,
        }
      : issue
  );

  projectState = {
    ...projectState,
    updatedAt: now,
    issues,
  };

  return projectState;
}

export async function updateIssuePositions(issuesToUpdate: JIssue[]): Promise<JProject> {
  const map = new Map(issuesToUpdate.map((issue) => [issue.id, issue]));
  const now = new Date().toISOString();

  projectState = {
    ...projectState,
    updatedAt: now,
    issues: projectState.issues.map((issue) => {
      const updated = map.get(issue.id);
      if (!updated) {
        return issue;
      }
      return {
        ...issue,
        ...updated,
        updatedAt: now,
      };
    }),
  };

  return projectState;
}

export async function deleteIssue(issueId: string): Promise<JProject> {
  const now = new Date().toISOString();
  projectState = {
    ...projectState,
    updatedAt: now,
    issues: projectState.issues.filter((issue) => issue.id !== issueId),
  };
  return projectState;
}

export async function updateIssueComment(
  issueId: string,
  comment: {
    id: string;
    body: string;
    createdAt: string;
    updatedAt: string;
    issueId: string;
    userId: string;
  }
): Promise<JProject> {
  const now = new Date().toISOString();
  projectState = {
    ...projectState,
    updatedAt: now,
    issues: projectState.issues.map((issue) => {
      if (issue.id !== issueId) {
        return issue;
      }

      const existingIdx = issue.comments.findIndex((item) => item.id === comment.id);
      const comments = [...issue.comments];
      if (existingIdx >= 0) {
        comments[existingIdx] = comment;
      } else {
        comments.push(comment);
      }

      return {
        ...issue,
        comments,
        updatedAt: now,
      };
    }),
  };

  return projectState;
}

export async function createIssue(
  payload: Pick<JIssue, 'title' | 'description' | 'type' | 'priority' | 'status' | 'reporterId' | 'userIds'>
): Promise<JProject> {
  const now = new Date().toISOString();
  const maxPosition = Math.max(
    0,
    ...projectState.issues
      .filter((issue) => issue.status === payload.status)
      .map((issue) => issue.listPosition)
  );

  const newIssue: JIssue = {
    id: `${Math.ceil(Math.random() * 8000)}`,
    title: payload.title,
    description: payload.description,
    type: payload.type,
    priority: payload.priority,
    status: payload.status,
    listPosition: maxPosition + 1,
    estimate: null,
    timeSpent: null,
    timeRemaining: null,
    createdAt: now,
    updatedAt: now,
    reporterId: payload.reporterId,
    userIds: payload.userIds,
    comments: [],
    projectId: projectState.id,
  };

  projectState = {
    ...projectState,
    updatedAt: now,
    issues: [...projectState.issues, newIssue],
  };

  return projectState;
}
