import { IssueType, IssueStatus, IssuePriority } from '../interfaces/issue';

export const ISSUE_STATUS_ORDER: IssueStatus[] = [
  IssueStatus.BACKLOG,
  IssueStatus.SELECTED,
  IssueStatus.IN_PROGRESS,
  IssueStatus.DONE,
];

export const ISSUE_TYPE_OPTIONS = Object.values(IssueType);
export const ISSUE_STATUS_OPTIONS = Object.values(IssueStatus);
export const ISSUE_PRIORITY_OPTIONS = Object.values(IssuePriority);
