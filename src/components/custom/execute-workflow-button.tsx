import { FlaskConicalIcon } from "lucide-react";
import { useExecuteWorkflow } from "@/hooks/use-workflows";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  workflowId: string;
};

export const ExecuteWorkflowButton = ({ workflowId }: Props) => {
  const workflow = useExecuteWorkflow();

  const handleExecute = async () => {
    try {
      await workflow.mutateAsync({ workflowId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to execute workflow!");
    }
  };

  return (
    <Button
      className={cn("shadow-lg motion-preset-oscillate-md motion-duration-3000")}
      size="lg"
      onClick={handleExecute}
      disabled={workflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      {workflow.isPending ? "Executing..." : "Execute workflow"}
    </Button>
  );
};
