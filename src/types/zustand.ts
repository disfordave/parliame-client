import { Party } from "@/types";

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

interface DefaultCountryValueState {
  defaultCountryValue: string | null;
  setDefaultCountryValue: (by: string) => void;
}

interface PartiesState {
  parties: Party[];
  setParties: (by: Party[]) => void;
}

interface SelectedPartiesState {
  selectedParties: Party[];
  setSelectedParties: (by: Party[]) => void;
}

interface IsEditModeState {
  isEditMode: boolean;
  setIsEditMode: (by: boolean) => void;
}

interface SortByState {
  sortBy: "name" | "seats" | "position";
  setSortBy: (by: "name" | "seats" | "position") => void;
}

interface AllowTieBreakerState {
  allowTieBreaker: boolean;
  setAllowTieBreaker: (by: boolean) => void;
}

export type {
  BearState,
  DefaultCountryValueState,
  PartiesState,
  SelectedPartiesState,
  IsEditModeState,
  SortByState,
  AllowTieBreakerState,
};
