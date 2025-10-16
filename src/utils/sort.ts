import { IsEditModeState, Party, SortByState } from "@/types";

export const sort = (
  a: Party,
  b: Party,
  isEditMode: IsEditModeState["isEditMode"],
  sortBy: SortByState["sortBy"],
) => {
  if (isEditMode) return 0; // Stop sorting if edit mode is on
  if (sortBy === "name") {
    const aIsIndependent = a.isIndependent === true;
    const bIsIndependent = b.isIndependent === true;

    // If both are independent, maintain original order
    if (aIsIndependent && bIsIndependent) return 0;

    // If only a is independent, push it to the end
    if (aIsIndependent) return 1;

    // If only b is independent, push it to the end
    if (bIsIndependent) return -1;

    return a.shortName.localeCompare(b.shortName);
  }
  if (sortBy === "seats") {
    const aIsIndependent = a.isIndependent === true;
    const bIsIndependent = b.isIndependent === true;

    // If both are independent, maintain original order
    if (aIsIndependent && bIsIndependent) return 0;

    // If only a is independent, push it to the end
    if (aIsIndependent) return 1;

    // If only b is independent, push it to the end
    if (bIsIndependent) return -1;

    // If neither is independent, sort by seats in descending order
    return b.seats - a.seats;
  }
  if (sortBy === "position") return a.position - b.position;
  return 0;
};
