import { workflowParams } from "@/modules/workflows/server/params";
import { useQueryStates } from "nuqs";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowParams);
};
