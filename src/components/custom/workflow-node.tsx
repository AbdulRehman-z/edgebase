import { NodeToolbar, Position } from "@xyflow/react";
import { SettingsIcon, TrashIcon } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  children: React.ReactNode;
  showToolbar?: boolean;
  onSettings?: () => void;
  onDelete?: () => void;
  name?: string;
  description?: string;
};

export const WorkflowNode = ({
  children,
  showToolbar,
  onSettings,
  onDelete,
  name,
  description,
}: Props) => {
  return (
    <>
      {showToolbar && (
        <NodeToolbar>
          <Button onClick={onSettings}>
            <SettingsIcon />
            Settings
          </Button>
          <Button onClick={onDelete}>
            <TrashIcon />
            Delete
          </Button>
        </NodeToolbar>
      )}
      {children}
      {name && (
        <NodeToolbar
          position={Position.Bottom}
          isVisible
          className="max-w-48 text-center"
        >
          <p className="font-medium">{name}</p>
          {description && (
            <p className="text-sm truncate text-muted-foreground">{description}</p>
          )}
        </NodeToolbar>
      )}
    </>
  );
};
