/*
    Parliament (parliament-seats) is a tool for visualizing and calculating
    the distribution of seats in a parliamentary system.

    Copyright (C) 2025 @disfordave

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { useI18n } from "./lib/zustandStore";

export default function About() {
  const { i } = useI18n();
  return (
    <div className={"flex-1 py-4"}>
      <h1 className={"mb-4 text-2xl font-bold"}>About Parliame.com</h1>
      <p className={"mb-4"}>
        Parliament Seats is a tool for visualizing and calculating the
        distribution of seats in a parliamentary system.
      </p>
      <p className={"mb-4"}>
        This project is open source and licensed under the GNU General Public
        License v3.0. View the source code on{" "}
        <a
          className={"underline hover:no-underline"}
          rel={"noreferrer noopener"}
          target={"_blank"}
          href="https://github.com/disfordave/parliament-seats"
        >
          GitHub
        </a>
        .
      </p>
      <p className={"mb-4"}>
        {i("footer.feelFree")}{" "}
        <a
          className={"underline hover:no-underline"}
          href={"https://disfordave.com/projects/parliament/#comments"}
          rel={"noreferrer noopener"}
          target={"_blank"}
        >
          {i("footer.myWebsite")}
        </a>{" "}
        {i("footer.ifYouHave")}
      </p>
      <p className={"mb-4"}>
        Created by{" "}
        <a
          href="https://disfordave.com"
          className="underline hover:no-underline"
          rel={"noreferrer noopener"}
          target={"_blank"}
        >
          @disfordave
        </a>
        .
      </p>
    </div>
  );
}
