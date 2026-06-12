"use client";

import { useState } from 'react';
import { Avatar, Modal, Popover, Select, Tooltip } from 'antd';
import { PlusOutlined, QuestionCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUserQuery, useProjectQuery } from '@/hooks/use-project-query';
import { createIssue } from '@/services/project.service';
import { IssuePriority, IssueStatus, IssueType, type JProject, type JUser } from '@/interfaces';

const navItems = [
  { key: 'search', icon: <SearchOutlined className="text-xl text-white" />, tooltip: 'Search issues' },
  { key: 'create', icon: <PlusOutlined className="text-xl text-white" />, tooltip: 'Create issue' },
];

export function NavbarLeft() {
  const queryClient = useQueryClient();
  const { data: project } = useProjectQuery();
  const { data: currentUser } = useCurrentUserQuery();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>(IssueType.TASK);
  const [priority, setPriority] = useState<IssuePriority>(IssuePriority.MEDIUM);
  const [reporterId, setReporterId] = useState('');
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  function issueTypeIcon(issueType: IssueType) {
    if (issueType === IssueType.BUG) {
      return (
        <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
          <g transform="translate(1 1)" fill="none" fillRule="evenodd">
            <rect fill="#E5493A" width="14" height="14" rx="2" />
            <path d="M10 7a3 3 0 11-6 0 3 3 0 016 0" fill="#FFF" />
          </g>
        </svg>
      );
    }
    if (issueType === IssueType.STORY) {
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
    }
    return (
      <svg viewBox="0 0 16 16" className="h-5 w-5" aria-hidden="true">
        <g transform="translate(1 1)" fill="none" fillRule="evenodd">
          <rect fill="#4BADE8" width="14" height="14" rx="2" />
          <path d="M6 9.5l4-5m-4 5l-2-2" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  function priorityIcon(value: IssuePriority) {
    const down = value === IssuePriority.LOW || value === IssuePriority.LOWEST;
    const colorMap: Record<IssuePriority, string> = {
      [IssuePriority.HIGHEST]: '#CD1317',
      [IssuePriority.HIGH]: '#E9494A',
      [IssuePriority.MEDIUM]: '#E97F33',
      [IssuePriority.LOW]: '#2D8738',
      [IssuePriority.LOWEST]: '#57A55A',
    };
    if (down) {
      return (
        <svg viewBox="0 0 6.35 7.938" className="h-5 w-5" style={{ color: colorMap[value] }} aria-hidden="true">
          <path
            d="M3.17.526a.265.265 0 00-.26.268v4.125L.982 2.987a.265.265 0 00-.19-.08.265.265 0 00-.185.455l2.38 2.38a.265.265 0 00.25.071.265.265 0 00.025-.007.265.265 0 00.025-.01.265.265 0 00.023-.012.265.265 0 00.002-.001.265.265 0 00.02-.013.265.265 0 00.017-.014.265.265 0 00.004-.004.265.265 0 00.01-.01l.009-.009 2.372-2.372a.265.265 0 10-.373-.375l-1.93 1.93V.793a.265.265 0 00-.27-.268z"
            fill="currentColor"
          />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 6.35 7.938" className="h-5 w-5" style={{ color: colorMap[value] }} aria-hidden="true">
        <path
          d="M3.17.526a.265.265 0 00-.205.104L.605 2.987a.265.265 0 00.376.375L2.91 1.43v4.125a.265.265 0 10.53 0V1.433L5.37 3.362a.265.265 0 10.373-.375L3.383.628A.265.265 0 003.17.526z"
          fill="currentColor"
        />
      </svg>
    );
  }

  function timesIcon() {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z" fill="currentColor" />
      </svg>
    );
  }

  function userRow(user: JUser) {
    return (
      <div className="flex items-center">
        <img src={user.avatarUrl} alt={user.name} className="h-5 w-5 rounded-full" />
        <span className="ml-[6px] mr-[6px] -mt-[3px] text-[14.5px] text-[#42526E]">{user.name}</span>
      </div>
    );
  }

  const createIssueMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<JProject>(['project'], updatedProject);
      setIsCreateOpen(false);
      setTitle('');
      setDescription('');
      setType(IssueType.TASK);
      setPriority(IssuePriority.MEDIUM);
      setReporterId('');
      setAssigneeIds([]);
    },
  });

  function openCreateIfAllowed() {
    if (!project || !currentUser) {
      return;
    }
    setReporterId(currentUser.id);
    setAssigneeIds([]);
    setIsCreateOpen(true);
  }

  function submitCreateIssue() {
    if (!project || !currentUser || !title.trim()) {
      return;
    }

    createIssueMutation.mutate({
      title,
      description,
      type,
      priority,
      status: IssueStatus.BACKLOG,
      reporterId: reporterId || currentUser.id,
      userIds: assigneeIds,
    });
  }

  return (
    <>
      <aside className="w-[56px] h-full bg-[#0747A6] flex flex-col items-center py-3 shrink-0">
      {/* Logo */}
      <div className="w-8 h-8 mb-6 flex items-center justify-center" title="Jira Clone">
        <svg
          className="w-8 h-8 text-white"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M15.967 29.362a6.675 6.675 0 0 0 0-9.442l-8.699-8.671-3.957 3.957a1.062 1.062 0 0 0 0 1.5l12.656 12.656zm12.656-14.156L15.967 2.55l-.039.039a6.675 6.675 0 0 0 .028 9.41l8.706 8.667 3.96-3.96a1.062 1.062 0 0 0 0-1.5z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Nav icons */}
      <div className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => (
          <Tooltip key={item.key} title={item.tooltip} placement="right">
            <button
              onClick={item.key === 'create' ? openCreateIfAllowed : undefined}
              className="w-9 h-9 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              {item.icon}
            </button>
          </Tooltip>
        ))}
      </div>

      {currentUser ? (
        <Tooltip title={currentUser.name} placement="right">
          <div className="mb-2 w-9 h-9 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors cursor-pointer">
            <Avatar src={currentUser.avatarUrl} size={26} />
          </div>
        </Tooltip>
      ) : null}

      <Popover
        trigger="click"
        placement="rightBottom"
        content={
          <div className="w-[280px] text-[14px] text-[#172b4d] leading-[1.4]">
            <p className="mb-2">This is a <strong>simplified</strong> Jira clone built with Angular, Akita and ng-zorro</p>
            <p className="mb-2">Thanks a bunch for stopping by and supporting me!</p>
            <p className="mb-3">
              Reach out via{' '}
              <a className="font-semibold" href="mailto:trungk18@gmail.com">
                trungk18@gmail.com
              </a>
            </p>
            <a
              href="https://trungk18.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[13px] font-medium hover:bg-[#0747a6]"
            >
              Visit My Blog
            </a>
          </div>
        }
      >
        <Tooltip title="About" placement="right">
          <button className="w-9 h-9 rounded flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <QuestionCircleFilled className="text-xl text-white" />
          </button>
        </Tooltip>
      </Popover>

      </aside>

      <Modal
        open={isCreateOpen}
        footer={null}
        closable={false}
        onCancel={() => setIsCreateOpen(false)}
        width={700}
        styles={{ body: { padding: 0 } }}
      >
        <div className="px-8 py-5 text-[#172b4d]">
          <div className="flex items-center py-3 text-[#172b4d]">
            <div className="text-xl">Create issue</div>
            <div className="flex-auto" />
            <button
              onClick={() => setIsCreateOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[3px] text-[#42526E] hover:bg-[#ebecf0]"
            >
              {timesIcon()}
            </button>
          </div>

          <div className="mt-1">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Issue type</label>
            <Select
              className="w-full"
              value={type}
              onChange={(value) => setType(value as IssueType)}
              options={Object.values(IssueType).map((value) => ({
                value,
                label: (
                  <div className="flex items-center">
                    {issueTypeIcon(value)}
                    <span className="ml-3 font-semibold uppercase text-[#5e6c84] text-[13px]">{value}</span>
                  </div>
                ),
              }))}
            />
          </div>

          <div className="mt-3">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Issue priority</label>
            <Select
              className="w-full"
              value={priority}
              onChange={(value) => setPriority(value as IssuePriority)}
              options={Object.values(IssuePriority).map((value) => ({
                value,
                label: (
                  <div className="flex items-center">
                    {priorityIcon(value)}
                    <span className="ml-3 font-semibold uppercase text-[#5e6c84] text-[13px]">{value}</span>
                  </div>
                ),
              }))}
            />
          </div>

          <div className="mt-3">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Short summary</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-full w-full rounded-[3px] border border-[#ddd] px-3 py-[6px] text-[15px] text-[#172b4d] outline-none hover:bg-[#ebecf0] focus:bg-white focus:border-[#4c9aff] focus:shadow-[0_0_0_1px_#4c9aff]"
            />
          </div>

          <div className="mt-3">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] w-full rounded-[3px] border border-[#ddd] px-3 py-[7px] text-[15px] text-[#172b4d] outline-none hover:bg-[#ebecf0] focus:bg-white focus:border-[#4c9aff] focus:shadow-[0_0_0_1px_#4c9aff]"
            />
          </div>

          <div className="mt-3">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Reporter</label>
            <Select
              className="w-full"
              value={reporterId || undefined}
              onChange={(value) => setReporterId(value)}
              options={(project?.users ?? []).map((user) => ({
                value: user.id,
                label: userRow(user),
              }))}
            />
          </div>

          <div className="mt-3">
            <label className="block pb-2 text-[13px] font-medium text-[#5e6c84]">Assignees</label>
            <Select
              className="w-full"
              mode="multiple"
              value={assigneeIds}
              onChange={(values) => setAssigneeIds(values)}
              options={(project?.users ?? []).map((user) => ({
                value: user.id,
                label: userRow(user),
              }))}
              notFoundContent="No user found."
            />
          </div>

          <div className="mt-5 text-right">
            <button
              onClick={submitCreateIssue}
              disabled={!title.trim() || createIssueMutation.isPending}
              className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0747a6]"
            >
              Create Issue
            </button>
            <button
              onClick={() => setIsCreateOpen(false)}
              className="rounded-[3px] border border-transparent px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
