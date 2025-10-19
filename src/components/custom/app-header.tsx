import { SidebarTrigger } from "../ui/sidebar";

export const AppHeader = () => {
  return (
    <header className="h-14 flex shrink-0 p-2 gap-x-4 items-center">
      <SidebarTrigger />
    </header>
  );
};
