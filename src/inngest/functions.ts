import { and, eq } from "drizzle-orm";
import { db, workflow as workflowTable } from "@/db";
import type { NodeType } from "@/lib/types";
import { getExecutor } from "@/modules/workflows/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-requests";
import { inngest } from "./client";
import { topologicalSort } from "./utils";

// const openai = createOpenAI();
// const google = createGoogleGenerativeAI();
// const anthropic = createAnthropic();

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", retries: 0 },
  { event: "workflows/execute.workflow" },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId as string;

    await publish(
      httpRequestChannel().status({
        nodeId: workflowId,
        status: "loading",
      }),
    );

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await db.query.workflow.findFirst({
        where: and(eq(workflowTable.id, parseInt(workflowId, 10))),
        with: {
          nodes: true,
          connections: true,
        },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      if (!workflow.nodes) {
        throw new Error("Workflow nodes not found");
      }

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return { sortedNodes, result: context };
  },
);
