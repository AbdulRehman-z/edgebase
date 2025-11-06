import { db, workflow } from "@/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { and, eq } from "drizzle-orm";

export const workflowRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const [data] = await db
      .insert(workflow)
      .values({
        name: generateSlug(4),
        userId: parseInt(ctx.auth.user.id, 10), // Convert the user ID from string to number
      })
      .returning({ name: workflow.name, id: workflow.id });
    return data;
  }),
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .delete(workflow)
        .where(
          and(
            eq(workflow.id, parseInt(input.id)),
            eq(workflow.userId, parseInt(ctx.auth.user.id)),
          ),
        );
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(2).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(workflow)
        .set({ name: input.name })
        .where(
          and(
            eq(workflow.id, parseInt(input.id)),
            eq(workflow.userId, parseInt(ctx.auth.user.id)),
          ),
        );
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await db.query.workflow.findFirst({
        where: and(
          eq(workflow.id, parseInt(input.id)),
          eq(workflow.userId, parseInt(ctx.auth.user.id)),
        ),
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const workflows = await db.query.workflow.findMany({
      where: eq(workflow.userId, parseInt(ctx.auth.user.id)),
    });

    return workflows;
  }),
});
