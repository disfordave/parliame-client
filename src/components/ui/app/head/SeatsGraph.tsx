import {
  useAllowTieBreaker,
  useParties,
  useSelectedParties,
  useI18n,
  useSortBy,
  useIsEditMode,
} from "@/lib/zustandStore";
import { CaretDownIcon } from "@/components/icons/Icons";
import { sort } from "@/utils/sort";

export default function SeatsGraph() {
  const { parties } = useParties();
  const { selectedParties } = useSelectedParties();
  const { allowTieBreaker } = useAllowTieBreaker();
  const { isEditMode } = useIsEditMode();
  const { sortBy } = useSortBy();
  const { i } = useI18n();

  const total = parties.reduce((acc, party) => acc + party.seats, 0);
  const selectedTotal = selectedParties.reduce(
    (acc, party) => acc + party.seats,
    0,
  );

  const majorityThreshold = (
    total % 2 === 0
      ? total / 2 + (allowTieBreaker ? 0 : 1)
      : Math.ceil(total / 2)
  ) as number;

  return (
    <>
      <div className="sticky top-0 z-50 -mx-4 mb-4 bg-white px-4 pt-4 transition-colors duration-300 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <p className="flex-1">
            {selectedTotal === total || selectedTotal === 0 ? (
              ""
            ) : allowTieBreaker && majorityThreshold === selectedTotal ? (
              <span className="line-clamp-1 text-emerald-600 dark:text-emerald-400">
                {i("body.tieBreakerEnabled")}
              </span>
            ) : (total % 2 === 0 ? total / 2 + 1 : Math.ceil(total / 2)) <=
              selectedTotal ? (
              <span className="line-clamp-1 text-violet-600 dark:text-violet-400">
                {selectedTotal - majorityThreshold + (allowTieBreaker ? 0 : 1)}{" "}
                {selectedTotal -
                  majorityThreshold +
                  (allowTieBreaker ? 0 : 1) ===
                1
                  ? i("header.seat")
                  : i("header.seats")}{" "}
                {i("header.majority")}
              </span>
            ) : (
              <span className="text-rose-600 dark:text-rose-400">{`${
                majorityThreshold - selectedTotal
              } ${
                majorityThreshold - selectedTotal === 1
                  ? i("header.seat")
                  : i("header.seats")
              } ${i("header.left")}
                        `}</span>
            )}
          </p>
          <div
            className="relative flex items-center justify-center"
            title={`${
              total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)
            } ${i("header.seatsForMajority")}`}
          >
            <CaretDownIcon />
            <p className="absolute left-5 rtl:right-5">
              {total % 2 === 0
                ? total / 2 + (allowTieBreaker ? 0 : 1)
                : Math.ceil(total / 2)}{" "}
            </p>
          </div>
          <div className="flex flex-1 justify-end text-end">
            <p className="tabular-nums">
              <span className="font-semibold">{selectedTotal}</span> / {total}
            </p>
          </div>
        </div>
        <div
          className="relative flex h-12 w-full overflow-hidden rounded-lg bg-gray-200 transition-all dark:bg-gray-700"
          dir={sortBy === "position" ? "ltr" : ""}
        >
          {parties
            .sort((a, b) => sort(a, b, isEditMode, sortBy))
            .map((party, index) => (
              <div
                key={index}
                title={`${
                  party.isIndependent
                    ? party.shortName.length > 0
                      ? party.shortName + " (I)"
                      : "Independent"
                    : party.shortName
                } (${party.seats})`}
                style={{
                  backgroundColor: party.colour,
                  minWidth: "0%",
                  width: selectedParties.includes(party)
                    ? `${(party.seats / total) * 100}%`
                    : "0%",
                }}
                className={`r-0 h-full overflow-hidden text-ellipsis text-nowrap transition-[width] duration-300`}
              ></div>
            ))}
          <div className="bg-background-elevated absolute left-[calc(50%-1px)] h-full border-l-2 border-dashed border-violet-500"></div>
        </div>
        <hr className="-mx-4 mt-4 border-y border-gray-200 transition-colors duration-300 sm:-mx-0 dark:border-gray-700" />
      </div>
    </>
  );
}
