import { BearState, DefaultCountryValueState, PartiesState, IsEditModeState, SortByState, AllowTieBreakerState } from "@/types";
import { create } from "zustand";

const useBear = create<BearState>((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
  removeAllBears: () => set({ bears: 0 }),
}));

const useDefaultCountryValue = create<DefaultCountryValueState>((set) => ({
  defaultCountryValue: null,
  setValue: (by) => set(() => ({ defaultCountryValue: by }))
}))

const useParties = create<PartiesState>((set) => (
  {
    parties: [],
    setParties: (by) => set(() => ({parties: by}))
  }
))

const useIsEditMode = create<IsEditModeState>((set) => ({
  isEditMode: false,
  setIsEditMode: (by) => set(() => ({ isEditMode: by }))
}))

const useSortBy = create<SortByState>((set) => ({
  sortBy: "seats",
  setSortBy: (by) => set(() => ({ sortBy: by }))
}))

const useAllowTieBreaker = create<AllowTieBreakerState>((set) => ({
  allowTieBreaker: false,
  setAllowTieBreaker: (by) => set(() => ({ allowTieBreaker: by }))
}))

export { useBear, useDefaultCountryValue, useParties, useIsEditMode, useSortBy, useAllowTieBreaker };