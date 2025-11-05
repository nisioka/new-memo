import { create } from 'zustand';
import type { Memo } from '../types';

interface MemoState {
  memos: Memo[];
  currentMemo: Memo | null;
  setMemos: (memos: Memo[]) => void;
  setCurrentMemo: (memo: Memo | null) => void;
  addMemo: (memo: Memo) => void;
  updateMemo: (memo: Memo) => void;
  deleteMemo: (memoId: string) => void;
}

export const useMemoStore = create<MemoState>((set) => ({
  memos: [],
  currentMemo: null,
  setMemos: (memos) => set({ memos }),
  setCurrentMemo: (memo) => set({ currentMemo: memo }),
  addMemo: (memo) => set((state) => ({ memos: [...state.memos, memo] })),
  updateMemo: (memo) =>
    set((state) => ({
      memos: state.memos.map((m) => (m.id === memo.id ? memo : m)),
    })),
  deleteMemo: (memoId) =>
    set((state) => ({ memos: state.memos.filter((m) => m.id !== memoId) })),
}));
