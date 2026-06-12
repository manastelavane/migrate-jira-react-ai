import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { JIssue, JUser } from '@/interfaces';
import { IssuePriority, IssuePriorityColors, IssueType } from '@/interfaces';

interface IssueCardProps {
  issue: JIssue;
  users: JUser[];
  onOpenIssue: (issueId: string) => void;
}

function typeIcon(type: IssueType) {
  switch (type) {
    case IssueType.BUG:
      return (
        <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
          <g transform="translate(1 1)" fill="none" fillRule="evenodd">
            <rect fill="#E5493A" width="14" height="14" rx="2" />
            <path d="M10 7a3 3 0 11-6 0 3 3 0 016 0" fill="#FFF" />
          </g>
        </svg>
      );
    case IssueType.STORY:
      return (
        <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
          <g transform="translate(1 1)" fill="none" fillRule="evenodd">
            <rect fill="#63BA3C" width="14" height="14" rx="2" />
            <path
              d="M9 3H5a1 1 0 00-1 1v6.5a.5.5 0 00.5.5.49.49 0 00.41-.231l.004.001L6.84 8.54a.2.2 0 01.32 0l1.926 2.23.004-.001A.49.49 0 009.5 11a.5.5 0 00.5-.5V4a1 1 0 00-1-1"
              fill="#FFF"
            />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
          <g transform="translate(1 1)" fill="none" fillRule="evenodd">
            <rect fill="#4BADE8" width="14" height="14" rx="2" />
            <path d="M6 9.5l4-5m-4 5l-2-2" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      );
  }
}

function priorityIcon(priority: IssuePriority) {
  const lower = priority === IssuePriority.LOW || priority === IssuePriority.LOWEST;
  const color = IssuePriorityColors[priority];
  if (lower) {
    return (
      <svg viewBox="0 0 6.35 7.938" className="h-5 w-5" style={{ color }} aria-hidden="true">
        <path
          d="M3.17.526a.265.265 0 00-.26.268v4.125L.982 2.987a.265.265 0 00-.19-.08.265.265 0 00-.185.455l2.38 2.38a.265.265 0 00.25.071.265.265 0 00.025-.007.265.265 0 00.025-.01.265.265 0 00.023-.012.265.265 0 00.002-.001.265.265 0 00.02-.013.265.265 0 00.017-.014.265.265 0 00.004-.004.265.265 0 00.01-.01l.009-.009 2.372-2.372a.265.265 0 10-.373-.375l-1.93 1.93V.793a.265.265 0 00-.27-.268z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 6.35 7.938" className="h-5 w-5" style={{ color }} aria-hidden="true">
      <path
        d="M3.17.526a.265.265 0 00-.205.104L.605 2.987a.265.265 0 00.376.375L2.91 1.43v4.125a.265.265 0 10.53 0V1.433L5.37 3.362a.265.265 0 10.373-.375L3.383.628A.265.265 0 003.17.526z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IssueCard({ issue, users, onOpenIssue }: IssueCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: issue.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const assignees = users.filter((user) => issue.userIds.includes(user.id));

  return (
    <div ref={setNodeRef} style={style} className="mb-[5px] flex">
      <button
        type="button"
        onClick={() => onOpenIssue(issue.id)}
        {...attributes}
        {...listeners}
        className="flex flex-1 touch-manipulation cursor-pointer rounded-[3px] bg-white p-[10px] text-left transition-all duration-100 shadow-[rgba(9,30,66,0.25)_0px_1px_2px_0px] hover:bg-[#F4F5F7]"
      >
        <div className="flex flex-1 flex-col">
          <p className="pb-3 text-[15px] text-[#172B4D]">{issue.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center ml-1">
              {assignees.map((user) => (
                <img
                  key={user.id}
                  title={`Assignee: ${user.name}`}
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-6 h-6 rounded-full border-2 border-white -ml-1"
                />
              ))}
              <span className={`${assignees.length ? 'ml-3' : ''} uppercase text-xs text-[#5E6C84]`}>
                {issue.type}-{issue.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-base">
              <span title={issue.type}>{typeIcon(issue.type)}</span>
              <span title={issue.priority}>{priorityIcon(issue.priority)}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
