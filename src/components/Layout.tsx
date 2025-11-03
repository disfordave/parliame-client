import { Outlet } from "react-router";
import Footer from "./Footer";
import Header from "./Header";

export default function Layout() {
  return (
    <div>
      <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
        <div className="mx-auto max-w-6xl px-4 pt-4 min-h-screen flex flex-col ">
          <Header />
          <div className="h-full flex-1">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
