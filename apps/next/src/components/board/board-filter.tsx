'use client';

import type { JUser } from '@/interfaces';

interface BoardFilterProps {
  users: JUser[];
  selectedUserIds: string[];
  search: string;
  onlyMyIssues: boolean;
  ignoreResolved: boolean;
  hasAnyFilter: boolean;
  onSearchChange: (value: string) => void;
  onToggleUser: (userId: string) => void;
  onToggleOnlyMyIssues: () => void;
  onToggleIgnoreResolved: () => void;
  onResetAll: () => void;
}

export function BoardFilter({
  users,
  selectedUserIds,
  search,
  onlyMyIssues,
  ignoreResolved,
  hasAnyFilter,
  onSearchChange,
  onToggleUser,
  onToggleOnlyMyIssues,
  onToggleIgnoreResolved,
  onResetAll,
}: BoardFilterProps) {
  return (
    <div className="flex items-center mt-6 flex-wrap gap-3">
      <div className="relative w-40 mr-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97A0AF]">🔎</span>
        <input
          aria-label="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-[4px] border border-[#DFE1E6] bg-white pl-9 pr-3 py-2 text-[14px] outline-none focus:border-[#4C9AFF]"
          placeholder="Search"
        />
      </div>

      <div className="flex flex-row mr-1">
        {users.map((user) => {
          const selected = selectedUserIds.includes(user.id);
          return (
            <button
              key={user.id}
              title={user.name}
              onClick={() => onToggleUser(user.id)}
              className={`-ml-1 rounded-full transition-transform duration-100 hover:-translate-y-1 ${
                selected ? 'shadow-[0_0_0_4px_#1255b9] z-10' : ''
              }`}
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-white"
              />
            </button>
          );
        })}
      </div>

      <button
        onClick={onToggleOnlyMyIssues}
        className={`rounded-[3px] border px-3 py-[6px] text-[14px] ${
          onlyMyIssues
            ? 'border-[#0052CC] text-[#0052CC] bg-[#DEEBFF]'
            : 'border-[#DFE1E6] text-[#42526E] bg-white hover:bg-[#F4F5F7]'
        }`}
      >
        Only My Issues
      </button>

      <button
        onClick={onToggleIgnoreResolved}
        className={`rounded-[3px] border px-3 py-[6px] text-[14px] ${
          ignoreResolved
            ? 'border-[#0052CC] text-[#0052CC] bg-[#DEEBFF]'
            : 'border-[#DFE1E6] text-[#42526E] bg-white hover:bg-[#F4F5F7]'
        }`}
      >
        Ignore Resolved
      </button>

      {hasAnyFilter && (
        <div className="ml-1 flex items-center">
          <div className="mr-3 w-px self-stretch bg-[#DFE1E6]" />
          <button
            onClick={onResetAll}
            className="rounded-[3px] border border-[#DFE1E6] bg-white px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#F4F5F7]"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
