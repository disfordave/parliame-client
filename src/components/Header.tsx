/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useI18n } from "@/lib/zustandStore";
import { Logo } from "./icons/Logo";
import { Link } from "react-router";

export default function Header() {
  const { i } = useI18n();
  return (
    <>
      <header className={"flex flex-wrap items-center justify-between gap-2"}>
        <div>
          <Link to="/" className={"flex items-center gap-2"}>
            <Logo className="size-12 flex-shrink-0" />
            <div className="flex flex-col justify-start">
              <h1 className="text-2xl font-bold uppercase">Parliame</h1>
              <p className="text-sm leading-4 text-gray-600 dark:text-gray-500">
                {i("subtitle")}
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-2 text-lg font-semibold">
          <Link to="/" className="mx-2 hover:underline">
            Home
          </Link>
          <div className="h-4 w-1 border-x-2 border-gray-300 dark:border-gray-600"></div>
          <Link to="/data" className="mx-2 hover:underline">
            Data
          </Link>
          <div className="h-4 w-1 border-x-2 border-gray-300 dark:border-gray-600"></div>
          <Link to="/about" className="mx-2 hover:underline">
            About
          </Link>
        </nav>
      </header>
    </>
  );
}
