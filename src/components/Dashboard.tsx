import { Link, Outlet } from "react-router";

export default function Dashboard({h1 = "Data of Parliame.com"}: {h1?: string}) {
  return (
    <div className="py-4">
      <h1 className={"mb-1 text-2xl font-bold"}>
        <Link to="/data">{h1}</Link>
      </h1>
      <p className={"mb-2"}>
        Edit and manage parliamentary data such as chambers, parties, and polls.
      </p>
      <Outlet />
    </div>
  );
}
