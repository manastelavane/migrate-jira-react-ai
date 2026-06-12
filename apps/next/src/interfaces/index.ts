// Re-export shared domain interfaces for use in the Next app
export type { JIssue, JComment } from '@jira/shared';
export type { JProject } from '@jira/shared';
export type { JUser } from '@jira/shared';
export {
	IssueType,
	IssueStatus,
	IssueStatusDisplay,
	IssuePriority,
	IssuePriorityColors,
	ProjectCategory,
} from '@jira/shared';
