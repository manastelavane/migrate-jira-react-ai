import { create } from 'zustand';

interface BoardStore {
  selectedIssueId: string | null;
  search: string;
  selectedUserIds: string[];
  onlyMyIssues: boolean;
  ignoreResolved: boolean;
  isIssueModalOpen: boolean;
  setSelectedIssueId: (id: string | null) => void;
  setSearch: (text: string) => void;
  toggleSelectedUserId: (id: string) => void;
  toggleOnlyMyIssues: () => void;
  toggleIgnoreResolved: () => void;
  setIssueModalOpen: (value: boolean) => void;
  resetFilters: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  selectedIssueId: null,
  search: '',
  selectedUserIds: [],
  onlyMyIssues: false,
  ignoreResolved: false,
  isIssueModalOpen: false,
  setSelectedIssueId: (id) => set({ selectedIssueId: id }),
  setSearch: (text) => set({ search: text }),
  toggleSelectedUserId: (id) =>
    set((state) => ({
      selectedUserIds: state.selectedUserIds.includes(id)
        ? state.selectedUserIds.filter((item) => item !== id)
        : [...state.selectedUserIds, id],
    })),
  toggleOnlyMyIssues: () => set((state) => ({ onlyMyIssues: !state.onlyMyIssues })),
  toggleIgnoreResolved: () => set((state) => ({ ignoreResolved: !state.ignoreResolved })),
  setIssueModalOpen: (value) => set({ isIssueModalOpen: value }),
  resetFilters: () =>
    set({
      search: '',
      selectedUserIds: [],
      onlyMyIssues: false,
      ignoreResolved: false,
    }),
}));
