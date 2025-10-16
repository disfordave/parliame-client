import { useI18n } from "@/i18n/i18n";
import { useParties, useSelectedParties } from "@/lib/zustandStore";

interface ButtonConfig {
  label: string;
  onClick: () => void;
}


export default function CoalitionBySpectrumButtons() {
      const { parties } = useParties();
  const { setSelectedParties } = useSelectedParties();
  const i = useI18n();
      const buttonConfigurations: ButtonConfig[] = [
        {
          label: i("controls.selectAll"),
          onClick: () => setSelectedParties([...parties]),
        },
        {
          label: i("controls.deselectAll"),
          onClick: () => setSelectedParties([]),
        },
        {
          label: i("controls.left"),
          onClick: () => {
            const leftParties = parties.filter((party) => party.position < 0);
            setSelectedParties(leftParties);
          },
        },
        {
          label: i("controls.right"),
          onClick: () => {
            const rightParties = parties.filter((party) => party.position > 0);
            setSelectedParties(rightParties);
          },
        },
        {
          label: i("controls.leftWithoutFarLeft"),
          onClick: () => {
            const leftParties = parties.filter(
              (party) => party.position < 0 && party.position > -100,
            );
            setSelectedParties(leftParties);
          },
        },
        {
          label: i("controls.rightWithoutFarRight"),
          onClick: () => {
            const rightParties = parties.filter(
              (party) => party.position > 0 && party.position < 100,
            );
            setSelectedParties(rightParties);
          },
        },
        {
          label: i("controls.leftWing"),
          onClick: () => {
            const leftParties = parties.filter((party) => party.position <= -75);
            setSelectedParties(leftParties);
          },
        },
        {
          label: i("controls.rightWing"),
          onClick: () => {
            const rightParties = parties.filter((party) => party.position >= 75);
            setSelectedParties(rightParties);
          },
        },
        {
          label: i("controls.centre"),
          onClick: () => {
            const centerParties = parties.filter(
              (party) =>
                party.position <= 25 &&
                party.position >= -25 &&
                !party.isIndependent,
            );
            setSelectedParties(centerParties);
          },
        },
        {
          label: i("controls.grandCentre"),
          onClick: () => {
            const centerParties = parties.filter(
              (party) =>
                party.position < 75 && party.position > -75 && !party.isIndependent,
            );
            setSelectedParties(centerParties);
          },
        },
        {
          label: i("controls.grandWithoutExtremes"),
          onClick: () => {
            const grandParties = parties.filter(
              (party) =>
                party.position > -100 &&
                party.position < 100 &&
                !party.isIndependent,
            );
            setSelectedParties(grandParties);
          },
        },
      ];

    return (
        <>
              <div className="mt-4 flex flex-wrap gap-2 overflow-auto rounded-lg bg-gray-200 p-4 dark:bg-gray-700">
        {buttonConfigurations.map((buttonConfig, index) => (
          <button
            key={index}
            onClick={buttonConfig.onClick}
            className="text-nowrap rounded-full border-2 border-transparent bg-white px-3 py-1 transition-colors hover:border-violet-600 dark:bg-gray-900 dark:hover:border-violet-400"
            type="button"
            title={buttonConfig.label}
            aria-label={buttonConfig.label}
            aria-describedby={buttonConfig.label}
            aria-disabled={false}
          >
            {buttonConfig.label}
          </button>
        ))}
      </div>
        </>
    )
}