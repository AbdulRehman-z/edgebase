import type { NodeExecutor } from "../../lib/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({
  nodeId,
  context,
  step,
}) => {
  const result = await step.run("manual-trigger", async () => context);

  return result;
};
