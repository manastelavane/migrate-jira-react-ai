'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CloseOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import type { MenuProps } from 'antd';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import type { JComment, JIssue, JProject, JUser } from '@/interfaces';
import { IssuePriority, IssuePriorityColors, IssueStatus, IssueStatusDisplay, IssueType } from '@/interfaces';
import { deleteIssue, updateIssue, updateIssueComment } from '@/services/project.service';

interface IssueDetailScreenProps {
  projectName: string;
  issue: JIssue;
  currentUser: JUser;
  reporter?: JUser;
  assignees: JUser[];
  commentUsers: Record<string, JUser | undefined>;
  users: JUser[];
  isModalView?: boolean;
  showBreadcrumbs?: boolean;
  onCloseModal?: () => void;
  onOpenIssuePage?: (issueId: string) => void;
}

function issueTypeIcon(type: IssueType) {
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

function issuePriorityIcon(priority: IssuePriority) {
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

function topIcon(name: 'feedback' | 'trash' | 'expand' | 'times' | 'plus') {
  if (name === 'feedback') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M10.881 5.48l-8.426 6.829c-.396.32-.582.956-.413 1.417l.099.272c.168.462.726.829 1.227.82l1.131-.02 6.062-.102 3.652-.063c.51-.01.788-.385.616-.861l-2.923-8.03c-.105-.288-.324-.441-.567-.441a.731.731 0 00-.458.179zM4.98 15.953l1.754 4.818a1 1 0 101.879-.684l-1.539-4.228-2.094.094zm13.711-9.111l-2.819 1.026a1 1 0 10.684 1.879l2.82-1.026a1 1 0 10-.685-1.88zm-1.792 3.845a1.006 1.006 0 00-.644.766 1.002 1.002 0 00.811 1.159l2.955.52a1 1 0 001.122-1.301l-.017-.047a.997.997 0 00-.758-.621l-2.955-.521a.974.974 0 00-.514.045zm-.548-7.639l-1.929 2.298a1 1 0 001.532 1.286l1.928-2.298a1.001 1.001 0 00-.765-1.643.993.993 0 00-.766.357z"
          fill="currentColor"
        />
      </svg>
    );
  }
  if (name === 'trash') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M5.003 20c0 1.103.897 2 2 2h10c1.103 0 2-.897 2-2V8h2V6h-4V4c0-1.103-.897-2-2-2h-6c-1.103 0-2 .897-2 2v2h-4v2h2v12zm4-16h6v2h-6V4zm-1 4h9l.001 12H7.003V8h1z" fill="currentColor" />
        <path d="M9.003 10h2v8h-2zm4 0h2v8h-2z" fill="currentColor" />
      </svg>
    );
  }
  if (name === 'expand') {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path d="M21 15.344L18.879 17.465 15.707 14.293 14.293 15.707 17.465 18.879 15.344 21 21 21zM3 8.656L5.121 6.535 8.293 9.707 9.707 8.293 6.535 5.121 8.656 3 3 3zM21 3L15.344 3 17.465 5.121 14.293 8.293 15.707 9.707 18.879 6.535 21 8.656zM3 21L8.656 21 6.535 18.879 9.707 15.707 8.293 14.293 5.121 17.465 3 15.344z" fill="currentColor" />
      </svg>
    );
  }
  if (name === 'plus') {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
        <path d="M13 11V3.993A.997.997 0 0012 3c-.556 0-1 .445-1 .993V11H3.993A.997.997 0 003 12c0 .557.445 1 .993 1H11v7.007c0 .548.448.993 1 .993.556 0 1-.445 1-.993V13h7.007A.997.997 0 0021 12c0-.556-.445-1-.993-1H13z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M12 10.586L6.707 5.293a1 1 0 00-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 001.414 1.414L12 13.414l5.293 5.293a1 1 0 001.414-1.414L13.414 12l5.293-5.293a1 1 0 10-1.414-1.414L12 10.586z" fill="currentColor" />
    </svg>
  );
}

function statusButtonClass(status: IssueStatus) {
  if (status === IssueStatus.DONE) return 'bg-[#e3fcef] text-[#006644]';
  if (status === IssueStatus.IN_PROGRESS) return 'bg-[#deebff] text-[#0747a6]';
  if (status === IssueStatus.SELECTED) return 'bg-[#ebecf0] text-[#172b4d]';
  return 'bg-[#f4f5f7] text-[#5e6c84]';
}

function jiraMediumDate(dateStr: string) {
  return format(new Date(dateStr), 'MMM d, yyyy, h:mm:ss a');
}

const issueStatusOrder: IssueStatus[] = [
  IssueStatus.BACKLOG,
  IssueStatus.SELECTED,
  IssueStatus.IN_PROGRESS,
  IssueStatus.DONE,
];

const issuePriorityOrder: IssuePriority[] = [
  IssuePriority.LOWEST,
  IssuePriority.LOW,
  IssuePriority.MEDIUM,
  IssuePriority.HIGH,
  IssuePriority.HIGHEST,
];

export function IssueDetailScreen({
  projectName,
  issue,
  currentUser,
  reporter,
  assignees,
  commentUsers,
  users,
  isModalView = false,
  showBreadcrumbs = true,
  onCloseModal,
  onOpenIssuePage,
}: IssueDetailScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [localIssue, setLocalIssue] = useState(issue);
  const [localReporter, setLocalReporter] = useState(reporter);
  const [localAssignees, setLocalAssignees] = useState(assignees);
  const [localCommentUsers, setLocalCommentUsers] = useState(commentUsers);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [commentBody, setCommentBody] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setLocalIssue(issue);
    setLocalReporter(reporter);
    setLocalAssignees(assignees);
    setLocalCommentUsers(commentUsers);
  }, [issue, reporter, assignees, commentUsers]);

  useEffect(() => {
    function onKeyUp(event: KeyboardEvent) {
      if (isCommentEditing) {
        return;
      }
      if (event.key === 'M') {
        setIsCommentEditing(true);
      }
    }

    window.addEventListener('keyup', onKeyUp);
    return () => window.removeEventListener('keyup', onKeyUp);
  }, [isCommentEditing]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: localIssue.description,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && !isDescriptionEditing) {
      editor.commands.setContent(localIssue.description || '<p></p>');
    }
  }, [editor, localIssue.description, isDescriptionEditing]);

  const patchProjectCache = (updatedProject: JProject) => {
    queryClient.setQueryData(['project'], updatedProject);
  };

  const updateIssueMutation = useMutation({
    mutationFn: updateIssue,
    onSuccess: (updatedProject) => {
      patchProjectCache(updatedProject);
      const freshIssue = updatedProject.issues.find((item) => item.id === localIssue.id);
      if (freshIssue) {
        setLocalIssue(freshIssue);
        setLocalReporter(updatedProject.users.find((user) => user.id === freshIssue.reporterId));
        setLocalAssignees(updatedProject.users.filter((user) => freshIssue.userIds.includes(user.id)));
      }
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: ({ issueId, comment }: { issueId: string; comment: JComment }) =>
      updateIssueComment(issueId, comment),
    onSuccess: (updatedProject) => {
      patchProjectCache(updatedProject);
      const freshIssue = updatedProject.issues.find((item) => item.id === localIssue.id);
      if (freshIssue) {
        setLocalIssue(freshIssue);
      }
    },
  });

  const deleteIssueMutation = useMutation({
    mutationFn: deleteIssue,
    onSuccess: (updatedProject) => {
      patchProjectCache(updatedProject);
      router.push('/project/board');
    },
  });

  const availableAssigneeToAdd = useMemo(
    () => users.find((user) => !localIssue.userIds.includes(user.id)),
    [users, localIssue.userIds]
  );

  const issueTypeMenuItems = useMemo<MenuProps['items']>(() => {
    const options: IssueType[] = [IssueType.TASK, IssueType.BUG, IssueType.STORY];
    return options
      .filter((option) => option !== localIssue.type)
      .map((option) => ({
        key: option,
        label: (
          <div className="flex items-center py-0.5">
            <span>{issueTypeIcon(option)}</span>
            <span className="ml-3 font-semibold uppercase text-[#5e6c84] text-[13px]">{option}</span>
          </div>
        ),
      }));
  }, [localIssue.type]);

  const issueStatusMenuItems = useMemo<MenuProps['items']>(() => {
    return issueStatusOrder
      .filter((status) => status !== localIssue.status)
      .map((status) => ({
        key: status,
        label: <span className="ml-3 font-semibold uppercase text-[#5e6c84] text-[13px]">{IssueStatusDisplay[status]}</span>,
      }));
  }, [localIssue.status]);

  const reporterMenuItems = useMemo<MenuProps['items']>(() => {
    return users
      .filter((user) => user.id !== localIssue.reporterId)
      .map((user) => ({
        key: user.id,
        label: (
          <div className="flex items-center py-0.5">
            <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full" />
            <span className="ml-[6px] mr-[6px] -mt-[3px] text-[14.5px] text-[#42526E]">{user.name}</span>
          </div>
        ),
      }));
  }, [users, localIssue.reporterId]);

  const priorityMenuItems = useMemo<MenuProps['items']>(() => {
    return issuePriorityOrder
      .filter((priority) => priority !== localIssue.priority)
      .map((priority) => ({
        key: priority,
        label: (
          <div className="flex items-center py-0.5">
            <span>{issuePriorityIcon(priority)}</span>
            <span className="ml-3 -mt-[3px] font-semibold uppercase text-[#5e6c84] text-[13px]">{priority}</span>
          </div>
        ),
      }));
  }, [localIssue.priority]);

  const addAssigneeMenuItems = useMemo<MenuProps['items']>(() => {
    return users
      .filter((user) => !localIssue.userIds.includes(user.id))
      .map((user) => ({
        key: user.id,
        label: (
          <div className="flex items-center py-0.5">
            <img src={user.avatarUrl} alt={user.name} className="w-5 h-5 rounded-full" />
            <span className="ml-[6px] mr-[6px] -mt-[3px] text-[14.5px] text-[#42526E]">{user.name}</span>
          </div>
        ),
      }));
  }, [users, localIssue.userIds]);

  function saveDescription() {
    if (!editor) {
      return;
    }

    const description = editor.getHTML();
    updateIssueMutation.mutate({
      ...localIssue,
      description,
    });
    setIsDescriptionEditing(false);
  }

  function cancelDescription() {
    if (editor) {
      editor.commands.setContent(localIssue.description || '<p></p>');
    }
    setIsDescriptionEditing(false);
  }

  function saveComment() {
    if (!commentBody.trim()) {
      return;
    }

    const now = new Date().toISOString();
    const comment: JComment = {
      id: `${Date.now()}`,
      body: commentBody,
      createdAt: now,
      updatedAt: now,
      issueId: localIssue.id,
      userId: currentUser.id,
    };

    updateCommentMutation.mutate({ issueId: localIssue.id, comment });
    setLocalCommentUsers((prev) => ({ ...prev, [currentUser.id]: currentUser }));
    setCommentBody('');
    setIsCommentEditing(false);
  }

  function cancelComment() {
    setCommentBody('');
    setIsCommentEditing(false);
  }

  function updateStatus(status: IssueStatus) {
    updateIssueMutation.mutate({ ...localIssue, status });
  }

  function updatePriority(priority: IssuePriority) {
    updateIssueMutation.mutate({ ...localIssue, priority });
  }

  function updateReporter(reporterId: string) {
    updateIssueMutation.mutate({ ...localIssue, reporterId });
  }

  function updateType(type: IssueType) {
    updateIssueMutation.mutate({ ...localIssue, type });
  }

  function removeAssignee(userId: string) {
    updateIssueMutation.mutate({
      ...localIssue,
      userIds: localIssue.userIds.filter((id) => id !== userId),
    });
  }

  function addAssignee(userId: string) {
    if (!userId || localIssue.userIds.includes(userId)) {
      return;
    }

    updateIssueMutation.mutate({
      ...localIssue,
      userIds: [...localIssue.userIds, userId],
    });
  }

  return (
    <div className="pr-6 py-8 pl-8 h-full w-full flex flex-col text-[#172b4d]">
      {showBreadcrumbs ? <Breadcrumbs items={['Projects', projectName, 'Issue details']} /> : null}

      <div className="w-full h-full">
        <div className="flex items-center pt-4 text-[#172b4d]">
          <Dropdown
            trigger={['click']}
            menu={{
              items: issueTypeMenuItems,
              onClick: ({ key }) => updateType(key as IssueType),
            }}
          >
            <button className="-ml-3 inline-flex items-center gap-2 rounded-[3px] px-3 py-[6px] text-[13px] font-semibold uppercase text-[#5e6c84] hover:bg-[#ebecf0]">
              <span className="text-base">{issueTypeIcon(localIssue.type)}</span>
              {localIssue.type}-{localIssue.id}
            </button>
          </Dropdown>

          <div className="flex-auto" />

          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/trungk18/jira-clone-angular/issues/new"
            className="inline-flex items-center rounded-[3px] px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
          >
            <span className="mr-2 text-[#42526E]">{topIcon('feedback')}</span>
            Give Feedback
          </a>

          {isModalView ? (
            <button
              onClick={() => onOpenIssuePage?.(localIssue.id)}
              title="View full screen"
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-[3px] text-[#6b778c] hover:bg-[#ebecf0]"
            >
              {topIcon('expand')}
            </button>
          ) : null}

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-[3px] text-[#6b778c] hover:bg-[#ebecf0]"
          >
            {topIcon('trash')}
          </button>

          {isModalView ? (
            <button
              onClick={onCloseModal}
              title="Close"
              className="ml-1 inline-flex h-8 w-8 items-center justify-center rounded-[3px] text-[#6b778c] hover:bg-[#ebecf0]"
            >
              {topIcon('times')}
            </button>
          ) : null}
        </div>

        <div className="flex w-full flex-wrap pb-16">
          <div className="sm:w-full md:w-7/12 lg:w-4/6 pr-10">
            <h1 className="text-2xl font-medium mt-1 -ml-2 px-2 py-1">{localIssue.title}</h1>

            <div className="pt-4 pb-2 text-[15px] font-medium">Description</div>
            {isDescriptionEditing ? (
              <div>
                <div className="rounded-[3px] border border-[#dfe1e6] bg-white p-2">
                  <EditorContent editor={editor} className="min-h-[90px] text-[15px]" />
                </div>
                <div className="pt-3 flex items-center">
                  <button
                    onClick={saveDescription}
                    className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] hover:bg-[#0747a6]"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelDescription}
                    className="rounded-[3px] border border-transparent px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="relative min-h-[50px] cursor-pointer rounded-[3px] px-0 py-0 hover:bg-[#f4f5f7]"
                onClick={() => setIsDescriptionEditing(true)}
              >
                <div
                  className="ql-editor text-[15px] [&_h1]:text-2xl [&_h1]:font-medium [&_h1]:mb-2 [&_h2]:text-xl [&_h2]:font-medium [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#0052cc] [&_a]:underline [&_img]:max-w-full [&_img]:h-auto"
                  dangerouslySetInnerHTML={{ __html: localIssue.description || 'Click to add description' }}
                />
                <span className="absolute top-[3px] right-[3px] text-[#6b778c]">
                  <EditOutlined />
                </span>
              </div>
            )}

            <div className="pt-4 pb-2 text-[15px] font-medium">Comments</div>
            <div className="relative mt-3 text-[15px]">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="absolute top-0 left-0 w-[30px] h-[30px] rounded-full"
              />
              <div className="pl-10">
                <textarea
                  className="w-full rounded-[4px] border border-[#dfe1e6] px-4 py-3 text-[#8993a4] resize-none"
                  placeholder="Add a comment"
                  rows={2}
                  value={commentBody}
                  onClick={() => setIsCommentEditing(true)}
                  onChange={(e) => setCommentBody(e.target.value)}
                />
                {!isCommentEditing && (
                  <div className="text-xs mt-2 mb-4">
                    <strong>Pro tip:</strong> press <span className="px-1 font-semibold bg-[#dfe1e6]">M</span> to comment
                  </div>
                )}
                {isCommentEditing && (
                  <div className="flex pt-2 pb-4 items-center">
                    <button
                      onClick={saveComment}
                      className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] hover:bg-[#0747a6]"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelComment}
                      className="rounded-[3px] border border-transparent px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {localIssue.comments.length === 0 ? (
              <div className="pl-10 text-[#5e6c84] text-[14px]">No comments yet.</div>
            ) : (
              localIssue.comments.map((comment) => {
                const author = localCommentUsers[comment.userId];
                return (
                  <div key={comment.id} className="relative mt-3 text-[15px]">
                    <img
                      src={author?.avatarUrl || currentUser.avatarUrl}
                      alt={author?.name || 'User'}
                      className="absolute top-0 left-0 w-[30px] h-[30px] rounded-full"
                    />
                    <div className="pl-10">
                      <div className="inline-block mr-3 mb-2 text-[#42526E] font-medium">{author?.name || 'Unknown User'}</div>
                      <div className="inline-block pb-2 text-[#42526E] text-sm">{jiraMediumDate(comment.updatedAt)}</div>
                      <div dangerouslySetInnerHTML={{ __html: comment.body }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="sm:w-full md:w-5/12 lg:w-2/6 pt-1">
            <div className="mt-6 mb-1 uppercase text-[#5e6c84] text-[13px] font-bold">Status</div>
            <Dropdown
              trigger={['click']}
              menu={{
                items: issueStatusMenuItems,
                onClick: ({ key }) => updateStatus(key as IssueStatus),
              }}
            >
              <button
                className={`rounded-[3px] px-3 py-[6px] uppercase text-[13px] ${statusButtonClass(localIssue.status)}`}
              >
                {IssueStatusDisplay[localIssue.status]}
              </button>
            </Dropdown>

            <div className="mt-6 mb-1 uppercase text-[#5e6c84] text-[13px] font-bold">Reporter</div>
            <Dropdown
              trigger={['click']}
              menu={{
                items: reporterMenuItems,
                onClick: ({ key }) => updateReporter(String(key)),
              }}
            >
              <button className="inline-flex items-center rounded-[3px] bg-[#f4f5f7] px-3 py-[6px] text-[14px] text-[#42526E]">
                <img
                  src={localReporter?.avatarUrl || currentUser.avatarUrl}
                  alt={localReporter?.name || 'Reporter'}
                  className="w-5 h-5 rounded-full"
                />
                <span className="ml-[6px] mr-[6px] -mt-[3px]">{localReporter?.name || 'Unknown'}</span>
              </button>
            </Dropdown>

            <div className="mt-6 mb-1 uppercase text-[#5e6c84] text-[13px] font-bold">Assignees</div>
            <div className="flex flex-wrap">
              {localAssignees.map((assignee) => (
                <button
                  key={assignee.id}
                  className="mr-[6px] mb-2 inline-flex items-center rounded-[3px] bg-[#f4f5f7] px-3 py-[6px] text-[14px] text-[#42526E]"
                >
                  <img src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full" />
                  <span className="ml-[6px] mr-[6px] -mt-[3px]">{assignee.name}</span>
                  <span
                    onClick={() => removeAssignee(assignee.id)}
                    className="text-[#8993a4] hover:text-[#42526E]"
                  >
                    {topIcon('times')}
                  </span>
                </button>
              ))}
            </div>
            <Dropdown
              trigger={['click']}
              menu={{
                items: addAssigneeMenuItems,
                onClick: ({ key }) => addAssignee(String(key)),
              }}
            >
              <button className="inline-flex items-center text-[#0052cc] text-[12.5px] hover:underline">
                <span className="mr-1">{topIcon('plus')}</span>
                Add Assignee
              </button>
            </Dropdown>

            <div className="mt-6 mb-1 uppercase text-[#5e6c84] text-[13px] font-bold">Priority</div>
            <Dropdown
              trigger={['click']}
              menu={{
                items: priorityMenuItems,
                onClick: ({ key }) => updatePriority(key as IssuePriority),
              }}
            >
              <button className="inline-flex items-center rounded-[3px] bg-[#f4f5f7] px-3 py-[6px] text-[13px] font-semibold uppercase text-[#5e6c84]">
                <span className="text-base">{issuePriorityIcon(localIssue.priority)}</span>
                <span className="ml-3 -mt-[3px]">{localIssue.priority}</span>
              </button>
            </Dropdown>

            <div className="mt-3 pt-3 leading-loose border-t border-[#dfe1e6] text-[#5e6c84] text-[13px]">
              <div>Created - {jiraMediumDate(localIssue.createdAt)}</div>
              <div>Updated - {jiraMediumDate(localIssue.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={isDeleteModalOpen}
        footer={null}
        closable={false}
        onCancel={() => setIsDeleteModalOpen(false)}
        styles={{ body: { padding: 0 } }}
      >
        <div className="px-10 py-8">
          <div className="pb-4 text-2xl font-medium leading-normal text-[#172b4d]">
            Are you sure you want to delete this issue?
          </div>
          <p className="pb-4 whitespace-pre-wrap text-[15px]">This action cannot be undone.</p>
          <div className="flex pt-3">
            <button
              onClick={() => deleteIssueMutation.mutate(localIssue.id)}
              className="mr-2 rounded-[3px] bg-[#0052cc] px-3 py-[6px] text-white text-[14px] hover:bg-[#0747a6]"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-[3px] border border-transparent px-3 py-[6px] text-[14px] text-[#42526E] hover:bg-[#ebecf0]"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <style>{`
        .ql-editor p { margin: 0 0 10px; }
        .ql-editor img, .ql-editor video { display: inline-block; }
        .tiptap { min-height: 70px; outline: none; padding: 4px; font-size: 15px; }
      `}</style>
    </div>
  );
}
