"use client";

import { useUpdateWorkflowName } from "@/hooks/use-workflows";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { SaveIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { SidebarTrigger } from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

type Props = {
  workflowId: string;
};

const EditorSaveButton = ({ workflowId }: Props) => {
  return (
    <div className="ml-auto">
      <Button size="sm" onClick={() => {}} disabled={false}>
        <SaveIcon className="size-4" />
        Save
      </Button>
    </div>
  );
};

const EditorBreadcrumbs = ({ workflowId }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={`/workflows`}>
              Workflow
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorInputName workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

const EditorInputName = ({ workflowId }: Props) => {
  const trpc = useTRPC();
  const updateWorkflowName = useUpdateWorkflowName();
  const isUpdating = updateWorkflowName.isPending;
  const { data: workflow } = useSuspenseQuery(
    trpc.workflows.getOne.queryOptions(
      { id: parseInt(workflowId, 10) },
      { staleTime: Infinity },
    ),
  );
  const [name, setName] = useState(workflow.name);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(workflow.name);
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }

    try {
      await updateWorkflowName.mutateAsync({
        id: workflow.id,
        name: name,
      });
    } catch {
      setName(workflow.name);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      await handleSave();
    } else if (event.key === "Escape") {
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <InputGroup className="h-8">
        <InputGroupInput
          disabled={isUpdating}
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-[100px] h-7 w-auto px-2"
        />
        <InputGroupAddon align="inline-end">
          {!isUpdating && (
            <InputGroupButton variant="outline" onClick={handleSave}>
              Save
            </InputGroupButton>
          )}
          {isUpdating && <Spinner />}
        </InputGroupAddon>
      </InputGroup>
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:text-foreground transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

export const EditorHeader = ({ workflowId }: Props) => {
  return (
    <header className="h-14  border-b rounded-b-md flex shrink-0 px-5 gap-x-4 items-center">
      <SidebarTrigger />
      <div className="flex flex-row items-center justify-between w-full">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
