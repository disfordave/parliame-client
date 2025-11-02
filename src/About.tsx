import Footer from "./components/Footer";
import Header from "./components/Header";
import { useI18n } from "./lib/zustandStore";

export default function About() {
  const { i } = useI18n();
  return (
    <div className="min-h-screen bg-white text-gray-950 transition-colors duration-300 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col p-4">
        <Header />
        <div className={"flex-1 py-4"}>
          <h1 className={"mb-4 text-2xl font-bold"}>About Parliament Seats</h1>
          <p className={"mb-4"}>
            Parliament Seats is a tool for visualizing and calculating the
            distribution of seats in a parliamentary system.
          </p>
          <p className={"mb-4"}>
            This project is open source and licensed under the GNU General
            Public License v3.0. View the source code on{" "}
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
        <Footer />
      </div>
    </div>
  );
}
