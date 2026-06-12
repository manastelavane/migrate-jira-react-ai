'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DndContext,
  PointerSensor,
  closestCorners,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Modal } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { JIssue, JProject, JUser } from '@/interfaces';
import { IssueStatus } from '@/interfaces';
import { ISSUE_STATUS_ORDER } from '@jira/shared';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { BoardHeader } from './board-header';
import { BoardFilter } from './board-filter';
import { BoardColumns } from './board-columns';
import { useBoardStore } from '@/store/board.store';
import { updateIssuePositions } from '@/services/project.service';
import { IssueDetailScreen } from '@/components/issue/issue-detail-screen';

interface BoardScreenProps {
  project: JProject;
  currentUser: JUser;
}

function contains(haystack: string, needle: string) {
  return haystack.trim().toLowerCase().includes(needle.trim().toLowerCase());
}

export function BoardScreen({ project, currentUser }: BoardScreenProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openIssueId, setOpenIssueId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updatePositionsMutation = useMutation({
    mutationFn: updateIssuePositions,
    onMutate: async (issuesToUpdate) => {
      await queryClient.cancelQueries({ queryKey: ['project'] });
      const prev = queryClient.getQueryData<JProject>(['project']);
      if (!prev) {
        return { prev };
      }

      const updateMap = new Map(issuesToUpdate.map((issue) => [issue.id, issue]));
      queryClient.setQueryData<JProject>(['project'], {
        ...prev,
        issues: prev.issues.map((issue) => {
          const updated = updateMap.get(issue.id);
          return updated ? { ...issue, ...updated } : issue;
        }),
      });

      return { prev };
    },
    onError: (_error, _variables, context) => {
      if (context?.prev) {
        queryClient.setQueryData(['project'], context.prev);
      }
    },
  });

  const search = useBoardStore((state) => state.search);
  const selectedUserIds = useBoardStore((state) => state.selectedUserIds);
  const onlyMyIssues = useBoardStore((state) => state.onlyMyIssues);
  const ignoreResolved = useBoardStore((state) => state.ignoreResolved);
  const setSearch = useBoardStore((state) => state.setSearch);
  const toggleSelectedUserId = useBoardStore((state) => state.toggleSelectedUserId);
  const toggleOnlyMyIssues = useBoardStore((state) => state.toggleOnlyMyIssues);
  const toggleIgnoreResolved = useBoardStore((state) => state.toggleIgnoreResolved);
  const resetFilters = useBoardStore((state) => state.resetFilters);

  const hasAnyFilter =
    !!search.trim() || selectedUserIds.length > 0 || onlyMyIssues || ignoreResolved;

  const filteredIssues = useMemo(() => {
    return project.issues
      .filter((issue) => {
        if (search && !contains(issue.title ?? '', search)) {
          return false;
        }

        if (selectedUserIds.length > 0) {
          const selected = issue.userIds.some((id) => selectedUserIds.includes(id));
          if (!selected) {
            return false;
          }
        }

        if (onlyMyIssues && !issue.userIds.includes(currentUser.id)) {
          return false;
        }

        if (ignoreResolved && issue.status === IssueStatus.DONE) {
          return false;
        }

        return true;
      })
      .sort((a, b) => a.listPosition - b.listPosition);
  }, [project.issues, search, selectedUserIds, onlyMyIssues, ignoreResolved, currentUser.id]);

  const groupedIssues = useMemo(() => {
    const result = {
      [IssueStatus.BACKLOG]: [] as JIssue[],
      [IssueStatus.SELECTED]: [] as JIssue[],
      [IssueStatus.IN_PROGRESS]: [] as JIssue[],
      [IssueStatus.DONE]: [] as JIssue[],
    };

    filteredIssues.forEach((issue) => {
      if (!result[issue.status]) {
        return;
      }
      result[issue.status].push(issue);
    });

    return result;
  }, [filteredIssues]);

  const modalIssue = useMemo(
    () => (openIssueId ? project.issues.find((issue) => issue.id === openIssueId) : undefined),
    [openIssueId, project.issues]
  );

  const modalReporter = useMemo(
    () => (modalIssue ? project.users.find((user) => user.id === modalIssue.reporterId) : undefined),
    [modalIssue, project.users]
  );

  const modalAssignees = useMemo(
    () => (modalIssue ? project.users.filter((user) => modalIssue.userIds.includes(user.id)) : []),
    [modalIssue, project.users]
  );

  const modalCommentUsers = useMemo(() => {
    if (!modalIssue) {
      return {} as Record<string, JUser | undefined>;
    }

    return Object.fromEntries(
      modalIssue.comments.map((comment) => [comment.userId, project.users.find((user) => user.id === comment.userId)])
    );
  }, [modalIssue, project.users]);

  function getStatusByIssueId(issueId: string): IssueStatus | undefined {
    for (const status of ISSUE_STATUS_ORDER) {
      if (groupedIssues[status].some((issue) => issue.id === issueId)) {
        return status;
      }
    }
    return undefined;
  }

  function reorderWithPositions(status: IssueStatus, issues: JIssue[]): JIssue[] {
    return issues.map((issue, idx) => ({
      ...issue,
      status,
      listPosition: idx + 1,
    }));
  }

  function onDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;

    if (!overId) {
      return;
    }

    const sourceStatus = getStatusByIssueId(activeId);
    if (!sourceStatus) {
      return;
    }

    const targetStatus = ISSUE_STATUS_ORDER.includes(overId as IssueStatus)
      ? (overId as IssueStatus)
      : getStatusByIssueId(overId);

    if (!targetStatus) {
      return;
    }

    const sourceList = [...groupedIssues[sourceStatus]];
    const sourceIndex = sourceList.findIndex((issue) => issue.id === activeId);
    if (sourceIndex < 0) {
      return;
    }

    if (sourceStatus === targetStatus) {
      const targetIndex =
        overId === targetStatus
          ? sourceList.length - 1
          : sourceList.findIndex((issue) => issue.id === overId);

      if (targetIndex < 0 || targetIndex === sourceIndex) {
        return;
      }

      const moved = arrayMove(sourceList, sourceIndex, targetIndex);
      updatePositionsMutation.mutate(reorderWithPositions(sourceStatus, moved));
      return;
    }

    const targetList = [...groupedIssues[targetStatus]];
    const [movedIssue] = sourceList.splice(sourceIndex, 1);
    const targetIndex =
      overId === targetStatus
        ? targetList.length
        : targetList.findIndex((issue) => issue.id === overId);

    const insertAt = targetIndex < 0 ? targetList.length : targetIndex;
    targetList.splice(insertAt, 0, { ...movedIssue, status: targetStatus });

    const updates = [
      ...reorderWithPositions(sourceStatus, sourceList),
      ...reorderWithPositions(targetStatus, targetList),
    ];

    updatePositionsMutation.mutate(updates);
  }

  return (
    <div className="flex flex-col w-full h-full py-8 pl-8 pr-6">
      <Breadcrumbs items={['Projects', project.name, 'Kanban Board']} />
      <BoardHeader />

      <BoardFilter
        users={project.users}
        selectedUserIds={selectedUserIds}
        search={search}
        onlyMyIssues={onlyMyIssues}
        ignoreResolved={ignoreResolved}
        hasAnyFilter={hasAnyFilter}
        onSearchChange={setSearch}
        onToggleUser={toggleSelectedUserId}
        onToggleOnlyMyIssues={toggleOnlyMyIssues}
        onToggleIgnoreResolved={toggleIgnoreResolved}
        onResetAll={resetFilters}
      />

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
        <BoardColumns
          groupedIssues={groupedIssues}
          users={project.users}
          statuses={ISSUE_STATUS_ORDER}
          onOpenIssue={setOpenIssueId}
        />
      </DndContext>

      <Modal
        open={!!modalIssue}
        footer={null}
        closable={false}
        onCancel={() => setOpenIssueId(null)}
        width={1040}
        styles={{ body: { padding: 0 } }}
      >
        {modalIssue ? (
          <IssueDetailScreen
            projectName={project.name}
            issue={modalIssue}
            currentUser={currentUser}
            reporter={modalReporter}
            assignees={modalAssignees}
            commentUsers={modalCommentUsers}
            users={project.users}
            isModalView
            showBreadcrumbs={false}
            onCloseModal={() => setOpenIssueId(null)}
            onOpenIssuePage={(issueId) => {
              setOpenIssueId(null);
              router.push(`/project/issue/${issueId}`);
            }}
          />
        ) : null}
      </Modal>
    </div>
  );
}
