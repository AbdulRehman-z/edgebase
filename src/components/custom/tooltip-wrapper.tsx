import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type TooltipWrapperProps = {
  children: React.ReactNode;
  content: string;
};

export const TooltipWrapper = ({ children, content }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};
// <p>We&apos;ll use this to send you notifications</p>
