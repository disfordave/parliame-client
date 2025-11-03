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

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, Link } from "react-router";
import { RouterProvider } from "react-router/dom";
import About from "./About.tsx";
import Layout from "./components/Layout.tsx";
import Data from "./Data.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      {
        path: "/data",
        element: <Data />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "*",
        element: (
          <div className="flex w-full flex-col items-center justify-center gap-1 text-center">
            <p className="py-4 text-center text-2xl font-medium">
              404 Not Found
            </p>
            <Link to="/" className="underline hover:no-underline">
              Go to Home
            </Link>
          </div>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
