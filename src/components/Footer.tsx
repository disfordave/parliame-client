import { useI18n } from "@/lib/zustandStore";
import ThemeButton from "@/components/ui/settings/ThemeButton";

export default function Footer() {
  const { i } = useI18n();
  return (
    <>
      <div className={"mt-4 italic opacity-75"}>
        <p>
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
      </div>
      <footer
        className={
          "flex flex-wrap items-center justify-between gap-2 py-8 text-start"
        }
      >
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <a
            className={"no-underline hover:underline"}
            href={"https://disfordave.com"}
            rel={"noreferrer noopener"}
            target={"_blank"}
          >
            @disfordave
          </a>{" "}
        </p>
        <ThemeButton />
      </footer>
    </>
  );
}
