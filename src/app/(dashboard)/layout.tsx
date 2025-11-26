import { SidebarProviderWrapper } from "@/components/custom/sidebar-provider-wrapper";

const layout = (props: LayoutProps<"/">) => {
  return <SidebarProviderWrapper>{props.children}</SidebarProviderWrapper>;
};

export default layout;
