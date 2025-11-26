import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointer2Icon } from "lucide-react";
import Image from "next/image";
import { type ReactNode, useCallback } from "react";
import { toast } from "sonner";
import { type NodeType, NodeTypesCustom } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeTypesCustom.MANUAL_TRIGGER,
    label: "Trigger Manually",
    description: "Runs the flow on clicking the button, Excellent for getting started.",
    icon: MousePointer2Icon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeTypesCustom.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
  },
];

type NodeSelectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export const NodeSelector = ({ children, onOpenChange, open }: NodeSelectorProps) => {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeTypesCustom.MANUAL_TRIGGER) {
        const nodes = getNodes();

        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeTypesCustom.MANUAL_TRIGGER,
        );

        if (hasManualTrigger) {
          toast.error("Only one manual trigger is allowed");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialNode = nodes.some(
          (node) => node.type === NodeTypesCustom.INITIAL,
        );
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.9) * 200,
          y: centerY + (Math.random() - 0.2) * 200,
        });

        const newNode = {
          id: createId(),
          data: {},
          position: flowPosition,
          type: selection.type,
        };

        if (hasInitialNode) {
          return [newNode];
        }

        return [...nodes, newNode];
      });
    },
    [screenToFlowPosition, setNodes, getNodes],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col">
          {triggerNodes.map((node) => {
            const Icon = node.icon;

            return (
              <button
                key={node.type}
                type="button"
                className="w-full flex items-center gap-6 py-5 px-4 rounded-md cursor-pointer hover:border-b hover:shadow-sm transition-shadow text-left overflow-hidden"
                onClick={() => handleNodeSelect(node)}
              >
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={node.label}
                    className="size-5 object-contain rounded-sm"
                  />
                ) : (
                  <Icon className="size-5 object-contain rounded-sm" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{node.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
              </button>
            );
          })}
          {executionNodes.map((node) => {
            const Icon = node.icon;

            return (
              <button
                onClick={() => handleNodeSelect(node)}
                key={node.type}
                type="button"
                className="w-full flex items-center gap-6 py-5 px-4 rounded-md cursor-pointer hover:border-b hover:shadow-sm transition-shadow text-left overflow-hidden"
              >
                {typeof Icon === "string" ? (
                  <Image
                    src={Icon}
                    alt={node.label}
                    className="size-5 object-contain rounded-sm"
                  />
                ) : (
                  <Icon className="size-5 object-contain rounded-sm" />
                )}
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium">{node.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {node.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};
