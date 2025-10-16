import { useIsEditMode, useI18n } from "@/lib/zustandStore";

export default function SwitchViewModeButton() {
  const { isEditMode, setIsEditMode } = useIsEditMode();
  const { i } = useI18n();
  return (
    <>
      <div className="order-2 flex flex-1 select-none items-center justify-end gap-2 sm:order-3">
        <span
          title={"Switch to View Mode"}
          className="cursor-default select-none"
          onClick={() => setIsEditMode(false)}
        >
          {i("body.view")}
        </span>
        <div
          onClick={() => setIsEditMode(!isEditMode)}
          className={`relative flex h-6 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-gray-700`}
          title={isEditMode ? "Switch to View Mode" : "Switch to Edit Mode"}
        >
          <div
            className={`h-full w-6 rounded-full bg-violet-600 transition-all dark:bg-violet-400 ${
              isEditMode ? "translate-x-full rtl:-translate-x-full" : ""
            }`}
          ></div>
        </div>
        <span
          title="Switch to Edit Mode"
          className="cursor-default select-none"
          onClick={() => setIsEditMode(true)}
        >
          {i("body.edit")}
        </span>
      </div>
    </>
  );
}
