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
import { useEditorStore } from "@/lib/store";
import { useTRPC } from "@/trpc/client";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import { NODE_TYPES, NodeTypesCustom } from "@/lib/types";
import { nodeComponents } from "@/modules/workflows/components/node-components";
import { AddNodeButton } from "../custom/add-node-button";
import {
  EntityErrorStateView,
  EntityLoadingStateView,
} from "../custom/entity-components";
import { ExecuteWorkflowButton } from "../custom/execute-workflow-button";

type EditorProps = {
  workflowId: string;
};

export const Editor = ({ workflowId }: EditorProps) => {
  const { setEditor, theme } = useEditorStore();
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

  const hasManualTrigger = nodes.some(
    (node) => node.type === NodeTypesCustom.MANUAL_TRIGGER,
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeComponents}
        onConnect={onConnect}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background
          bgColor="var(--color-background)"
          variant={BackgroundVariant.Cross}
          gap={5}
          lineWidth={0.2}
        />
        <Controls />
        <Panel position="top-right">
          <AddNodeButton />
        </Panel>
        {hasManualTrigger && (
          <Panel position="bottom-center" className="pb-8">
            <ExecuteWorkflowButton workflowId={workflowId} />
          </Panel>
        )}
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
