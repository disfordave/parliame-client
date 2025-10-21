import {
  IsEditModeState,
  PartiesState,
  SelectedPartiesState,
  SortByState,
} from "@/types";
import { sort } from "@/utils/sort";
import { ResponsivePie } from "@nivo/pie";
import { useState, useEffect } from "react";

export default function PieChart({
  parties,
  selectedParties,
  isEditMode,
  sortBy,
}: {
  parties: PartiesState["parties"];
  selectedParties: SelectedPartiesState["selectedParties"];
  isEditMode: IsEditModeState["isEditMode"];
  sortBy: SortByState["sortBy"];
}) {
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);
  return (
    <>
      <ResponsivePie
        data={[
          ...selectedParties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party) => ({
              id: party.name.length < 1 ? party.shortName : party.name,
              label: party.name.length < 1 ? party.shortName : party.name,
              value: party.seats,
              color: party.colour,
            })),
          {
            id: "empty",
            label: "empty",
            value:
              parties.reduce((acc, party) => acc + party.seats, 0) -
              selectedParties.reduce((acc, party) => acc + party.seats, 0),
            color: isDarkMode ? "#374151" : "#e5e7eb",
          },
        ]}
        startAngle={-90}
        endAngle={90}
        margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
        sortByValue={false}
        innerRadius={0.35}
        colors={{ datum: "data.color" }}
        activeOuterRadiusOffset={8}
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        enableArcLabels={false}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
        isInteractive={false}
        transitionMode="innerRadius"
        motionConfig="default"
      />
    </>
  );
}
