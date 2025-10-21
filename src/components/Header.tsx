import { useI18n } from "@/lib/zustandStore";
import { LocaleSettingButton } from "@/components/ui/settings/";

export default function Header() {
  const { i } = useI18n();
  return (
    <>
      <header
        className={" flex flex-wrap items-center justify-between gap-2"}
      >
        <div className={"flex items-center gap-1"}>
          <img src={"/favicon.svg"} alt={"Parliament"} className={"size-8"} />
          <h1 className="text-2xl font-bold">{i("parliament")}</h1>
        </div>
        <div className="ms-2 flex gap-2">
          <LocaleSettingButton />
        </div>
      </header>
    </>
  );
}
