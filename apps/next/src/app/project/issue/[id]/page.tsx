import { notFound } from 'next/navigation';
import { IssueDetailScreen } from '@/components/issue/issue-detail-screen';
import { getCurrentUser, getIssueById, getProject, getUserById, getUsersByIds } from '@/services/project.service';

interface IssuePageProps {
  params: Promise<{ id: string }>;
}

export default async function IssueDetailPage({ params }: IssuePageProps) {
  const { id } = await params;

  const project = getProject();
  const issue = getIssueById(id);
  if (!issue) {
    notFound();
  }

  const currentUser = getCurrentUser();
  const reporter = getUserById(issue.reporterId);
  const assignees = getUsersByIds(issue.userIds);
  const commentUsers = Object.fromEntries(
    issue.comments.map((comment) => [comment.userId, getUserById(comment.userId)])
  );

  return (
    <IssueDetailScreen
      projectName={project.name}
      issue={issue}
      currentUser={currentUser}
      reporter={reporter}
      assignees={assignees}
      commentUsers={commentUsers}
      users={project.users}
    />
  );
}
