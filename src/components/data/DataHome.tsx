import { Link } from "react-router";

export default function DataHome() {
    return (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
        <li>
          <Link
            to="/data/countries"
            className={
              "flex aspect-square items-center justify-center rounded-2xl bg-gray-200 p-4 dark:bg-gray-700 text-center font-medium text-lg"
            }
          >
            Countries and Regions
          </Link>
        </li>
        <li>
          <Link
            to="/data/chambers"
            className={
              "flex aspect-square items-center justify-center rounded-2xl bg-gray-200 p-4 dark:bg-gray-700 text-center font-medium text-lg"
            }
          >
            Chambers
          </Link>
        </li>
        <li>
          <Link
            to="/data/parties"
            className={
              "flex aspect-square items-center justify-center rounded-2xl bg-gray-200 p-4 dark:bg-gray-700 text-center font-medium text-lg"
            }
          >
            Parties
          </Link>
        </li>
        <li>
          <Link
            to="/data/polls"
            className={
              "flex aspect-square items-center justify-center rounded-2xl bg-gray-200 p-4 dark:bg-gray-700 text-center font-medium text-lg"
            }
          >
            Polls
          </Link>
        </li>
      </ul>
    )
}