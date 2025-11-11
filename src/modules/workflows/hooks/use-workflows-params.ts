import { useQueryStates } from "nuqs";
import { workflowParams } from "../server/params";

export const useWorkflowsParams = () => {
  return useQueryStates(workflowParams);
};
