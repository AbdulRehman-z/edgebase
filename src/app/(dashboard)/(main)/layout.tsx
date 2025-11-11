import { AppHeader } from "@/components/custom/app-header";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <>
      <AppHeader />
      <main className="h-full">{children}</main>
    </>
  );
};

export default layout;
