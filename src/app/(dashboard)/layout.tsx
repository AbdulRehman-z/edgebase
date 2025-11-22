import type { ReactNode } from "react";
import { SidebarProviderWrapper } from "@/components/custom/sidebar-provider-wrapper";

type Props = {
  children: ReactNode;
};

const layout = ({ children }: Props) => {
  return <SidebarProviderWrapper>{children}</SidebarProviderWrapper>;
};

export default layout;
