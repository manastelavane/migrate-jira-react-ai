"use client";

import { useState } from 'react';
import { Avatar, Modal, Popover, Tooltip } from 'antd';
import { PlusOutlined, QuestionCircleFilled, SearchOutlined } from '@ant-design/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUserQuery, useProjectQuery } from '@/hooks/use-project-query';
import { createIssue } from '@/services/project.service';
import { IssuePriority, IssueStatus, IssueType, type JProject } from '@/interfaces';

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
  const [status, setStatus] = useState<IssueStatus>(IssueStatus.BACKLOG);

  const createIssueMutation = useMutation({
    mutationFn: createIssue,
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<JProject>(['project'], updatedProject);
      setIsCreateOpen(false);
      setTitle('');
      setDescription('');
      setType(IssueType.TASK);
      setPriority(IssuePriority.MEDIUM);
      setStatus(IssueStatus.BACKLOG);
    },
  });

  function openCreateIfAllowed() {
    if (!project || !currentUser) {
      return;
    }
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
      status,
      reporterId: currentUser.id,
      userIds: [currentUser.id],
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
        styles={{ body: { padding: 0 } }}
      >
        <div className="px-8 py-6 text-[#172b4d]">
          <div className="mb-4 text-2xl font-medium">Create issue</div>

          <div className="mb-3">
            <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] outline-none focus:border-[#4c9aff]"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] rounded-[3px] border border-[#DFE1E6] px-3 py-[7px] text-[15px] outline-none focus:border-[#4c9aff]"
            />
          </div>

          <div className="mb-3 grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as IssueType)}
                className="w-full rounded-[3px] border border-[#DFE1E6] px-2 py-[7px] text-[14px] outline-none focus:border-[#4c9aff]"
              >
                {Object.values(IssueType).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IssuePriority)}
                className="w-full rounded-[3px] border border-[#DFE1E6] px-2 py-[7px] text-[14px] outline-none focus:border-[#4c9aff]"
              >
                {Object.values(IssuePriority).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-1 text-[13px] font-semibold uppercase text-[#5e6c84]">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IssueStatus)}
                className="w-full rounded-[3px] border border-[#DFE1E6] px-2 py-[7px] text-[14px] outline-none focus:border-[#4c9aff]"
              >
                {Object.values(IssueStatus).map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex pt-3">
            <button
              onClick={submitCreateIssue}
              disabled={!title.trim() || createIssueMutation.isPending}
              className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0747a6]"
            >
              Create
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
