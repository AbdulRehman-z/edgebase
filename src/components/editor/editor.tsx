"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  Panel,
  ReactFlow,
} from "@xyflow/react";
import { useTRPC } from "@/trpc/client";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { nodeComponents } from "@/lib/node-components";
import {
  EntityErrorStateView,
  EntityLoadingStateView,
} from "../custom/entity-components";
import { AddNodeButton } from "../custom/add-node-button";

type EditorProps = {
  workflowId: string;
};

export const Editor = ({ workflowId }: EditorProps) => {
  const trpc = useTRPC();
  const { data: workflow } = useSuspenseQuery(
    trpc.workflows.getOne.queryOptions(
      { id: parseInt(workflowId, 10) },
      { staleTime: Infinity },
    ),
  );

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        colorMode="light"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeComponents}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} gap={8} lineWidth={0.6} />
        <Controls />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const EditorError = () => {
  return (
    <EntityErrorStateView message="Failed to fetch workflow. Try refreshing the page." />
  );
};

export const EditorLoading = () => {
  return <EntityLoadingStateView message="Hold tight! Loading workflow..." />;
};
