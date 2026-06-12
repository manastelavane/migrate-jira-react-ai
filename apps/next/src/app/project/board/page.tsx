'use client';

import { BoardScreen } from '@/components/board/board-screen';
import { useCurrentUserQuery, useProjectQuery } from '@/hooks/use-project-query';

export default function BoardPage() {
  const { data: project } = useProjectQuery();
  const { data: currentUser } = useCurrentUserQuery();

  if (!project || !currentUser) {
    return <div className="p-8 text-[#5e6c84]">Loading...</div>;
  }

  return <BoardScreen project={project} currentUser={currentUser} />;
}
