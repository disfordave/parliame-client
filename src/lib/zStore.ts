import { create } from "zustand";

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

const useBear = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  removeAllBears: () => set({ bears: 0 }),
}));

export { useBear };
