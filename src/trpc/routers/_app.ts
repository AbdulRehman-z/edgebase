import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { db, workflow } from "@/db";
import { workflowRouter } from "@/modules/workflows/server/procedures";

export const appRouter = createTRPCRouter({
  workflows: workflowRouter,
  getWorkFlows: baseProcedure.query(async () => {
    return await db.select().from(workflow);
  }),
  createWorkflow: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
      data: {
        email: "testUser@example.com",
      },
    });

    return { success: true, message: "AI job queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
