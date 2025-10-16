import { useParties } from "@/lib/zustandStore";

export default function AddNewPartyButton() {

    const { parties, setParties } = useParties();
    return (
        <>
        <button
              onClick={() => {
                setParties([
                  ...parties,
                  {
                    name: "",
                    shortName: "",
                    seats: 0,
                    colour: "#6B7280",
                    position: 0,
                    isIndependent: false,
                  },
                ]);
              }}
              className="m-4 aspect-square w-1/3 rounded-full border-2 border-transparent bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              type="button"
              title="Add Party"
              aria-label="Add Party"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="m-auto size-2/3 stroke-2 text-gray-950 dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
        </>
    )
}