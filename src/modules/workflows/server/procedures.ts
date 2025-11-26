import { TRPCError } from "@trpc/server";
import type { Edge, Node } from "@xyflow/react";
import { and, desc, eq, ilike } from "drizzle-orm";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { db, node, nodeTypeEnum, workflow, connection } from "@/db";
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from "@/lib/constants";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { NodeType, NODE_TYPES } from "@/lib/types";
import { da } from "zod/v4/locales";

export const workflowRouter = createTRPCRouter({
  create: premiumProcedure.mutation(async ({ ctx }) => {
    const [data] = await db
      .insert(workflow)
      .values({
        name: generateSlug(4),
        userId: parseInt(ctx.auth.user.id, 10),
      })
      .returning({ name: workflow.name, id: workflow.id });
    if (!data.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Workflow creation failed",
      });
    }

    await db.insert(node).values({
      workflowId: data.id,
      type: nodeTypeEnum.enumValues[0],
      position: { x: 0, y: 0 },
    });
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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        nodes: z.array(
          z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({
              x: z.number(),
              y: z.number(),
            }),
            data: z.record(z.string(), z.any()).optional(),
          }),
        ),
        edges: z.array(
          z.object({
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, edges, nodes, type } = input;
      const [data] = await db
        .select()
        .from(workflow)
        .where(
          and(eq(workflow.userId, parseInt(ctx.auth.user.id, 10)), eq(workflow.id, id)),
        );

      if (!data) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      await db.batch([
        db.delete(node).where(eq(node.workflowId, data.id)),
        db.insert(node).values(
          nodes.map((n) => {
            if (!NODE_TYPES.includes(n.type as NodeType)) {
              throw new TRPCError({
                code: "BAD_REQUEST",
                message: `Invalid node type: ${n.type}`,
              });
            }
            return {
              id: n.id,
              workflowId: data.id,
              type: n.type as NodeType,
              position: n.position,
              data: n.data,
            };
          }),
        ),
        db.insert(connection).values(
          edges.map((e) => ({
            workflowId: data.id,
            fromNodeId: e.source,
            toNodeId: e.target,
            fromOutput: e.sourceHandle || "main",
            toInput: e.targetHandle || "main",
          })),
        ),
        db
          .update(workflow)
          .set({
            updatedAt: new Date(),
          })
          .where(eq(workflow.id, data.id)),
      ]);

      return data;
    }),

  updateName: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [result] = await db
        .update(workflow)
        .set({ name: input.name })
        .where(
          and(eq(workflow.id, input.id), eq(workflow.userId, parseInt(ctx.auth.user.id))),
        )
        .returning({
          id: workflow.id,
          name: workflow.name,
        });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Couldn't update workflow name",
        });
      }

      return result;
    }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const result = await db.query.workflow.findFirst({
        where: and(
          eq(workflow.id, input.id),
          eq(workflow.userId, parseInt(ctx.auth.user.id)),
        ),
        with: {
          nodes: true,
          connections: true,
        },
      });

      if (!result) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workflow not found",
        });
      }

      // transform server nodes to react-flow compatiable nodes
      const nodes: Node[] = result.nodes.map((node) => ({
        id: node.id.toString(),
        position: node.position,
        data: node.data,
        type: node.type,
      }));

      // transform server connections to react-flow compatiable connections
      const edges: Edge[] = result.connections.map((connection) => ({
        id: connection.id.toString(),
        source: connection.fromNodeId.toString(),
        target: connection.toNodeId.toString(),
        sourceHandle: connection.fromOutput,
        targetHandle: connection.toInput,
      }));

      return {
        id: result.id,
        name: result.name,
        nodes,
        edges,
      };
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
