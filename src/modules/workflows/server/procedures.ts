import { db, workflow } from "@/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/lib/constants";

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
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .delete(workflow)
        .where(
          and(eq(workflow.id, input.id), eq(workflow.userId, parseInt(ctx.auth.user.id))),
        )
        .returning({
          id: workflow.id,
          name: workflow.name,
        });
      return data;
    }),
  updateName: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(workflow)
        .set({ name: input.name })
        .where(
          and(eq(workflow.id, input.id), eq(workflow.userId, parseInt(ctx.auth.user.id))),
        );
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return await db.query.workflow.findFirst({
        where: and(
          eq(workflow.id, input.id),
          eq(workflow.userId, parseInt(ctx.auth.user.id)),
        ),
      });
    }),
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const [count, items] = await Promise.all([
        db.$count(
          workflow,
          and(
            eq(workflow.userId, parseInt(ctx.auth.user.id)),
            ilike(workflow.name, `%${search}%`),
          ),
        ),
        db
          .select()
          .from(workflow)
          .where(
            and(
              eq(workflow.userId, parseInt(ctx.auth.user.id)),
              ilike(workflow.name, `%${search}%`),
            ),
          )
          .limit(pageSize)
          .offset((page - 1) * pageSize)
          .orderBy(desc(workflow.updatedAt)),
      ]);

      const totalPages = Math.ceil(count / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        count,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
