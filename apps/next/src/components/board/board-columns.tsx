import type { JIssue, JUser } from '@/interfaces';
import { IssueStatus, IssueStatusDisplay } from '@/interfaces';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { IssueCard } from './issue-card';

interface BoardColumnsProps {
  groupedIssues: Record<IssueStatus, JIssue[]>;
  users: JUser[];
  statuses: IssueStatus[];
  onOpenIssue: (issueId: string) => void;
}

interface BoardColumnProps {
  status: IssueStatus;
  issues: JIssue[];
  users: JUser[];
  onOpenIssue: (issueId: string) => void;
}

function BoardColumn({ status, issues, users, onOpenIssue }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      ref={setNodeRef}
      className={`mr-2 flex h-full w-[25%] min-w-[260px] flex-col rounded-[3px] pb-5 ${
        isOver ? 'bg-[#EBECF0]' : 'bg-[#F4F5F7]'
      }`}
    >
      <div className="truncate px-3 pb-4 pt-3 uppercase text-[#5E6C84] text-[13px]">
        {IssueStatusDisplay[status]} <span className="lowercase text-[13px]">{issues.length}</span>
      </div>
      <div className="h-full pl-2 pr-2">
        <SortableContext items={issues.map((issue) => issue.id)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} users={users} onOpenIssue={onOpenIssue} />
          ))}
        </SortableContext>
      </div>
    </section>
  );
}

export function BoardColumns({ groupedIssues, users, statuses, onOpenIssue }: BoardColumnsProps) {
  return (
    <div className="flex mt-7 overflow-x-auto pb-4">
      {statuses.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          issues={groupedIssues[status] ?? []}
          users={users}
          onOpenIssue={onOpenIssue}
        />
      ))}
    </div>
  );
}
