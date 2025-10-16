import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { inngest } from "@/inngest/client";
import { db, workflow } from "@/db";
export const appRouter = createTRPCRouter({
  getWorkFlows: baseProcedure.query(async () => {
    return await db.select().from(workflow);
  }),
  createWorkflow: baseProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "testUser@example.com",
      },
    });

    console.log("hello-world");
    return { success: true, message: "Job queued" };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
