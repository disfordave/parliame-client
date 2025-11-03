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
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import About from "./About.tsx";
import Dashboard from "./components/Dashboard.tsx";
import { Polls, Parties, Chambers, User, Countries } from "./components/data/index.ts";
import Layout from "./components/Layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [{ index: true, element: <App /> }, {
      path: "/data",
      element: <Dashboard />,
    }, {
      path: "/data/polls",
      element: <Polls />,
    }, {
      path: "/data/parties",
      element: <Parties />,
    }, {
      path: "/data/chambers",
      element: <Chambers />,
    }, {
      path: "/data/user",
      element: <User />,
    }, {
      path: "/data/countries",
      element: <Countries />,
    }, {
      path: "/about",
      element: <About />,
    }],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
