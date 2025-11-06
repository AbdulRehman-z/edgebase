"use client";

import { EntityContainer, EntityHeader } from "@/components/custom/entity-components";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { useCreateWorkflow } from "../hooks/use-workflows";
import { useUpgrade } from "../hooks/use-upgrade";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const WorkflowList = () => {
  const trpc = useTRPC();

  const { data: workflows } = useSuspenseQuery(trpc.workflows.getAll.queryOptions());

  return (
    <div className="flex flex-1 items-center justify-center">
      <pre>{JSON.stringify(workflows, null, 2)}</pre>
    </div>
  );
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const workflow = useCreateWorkflow();
  const { handleError, upgradeComponent } = useUpgrade();

  const handleCreateWorkflow = () => {
    workflow.mutate(undefined, {
      onSuccess: (data) => {
        router.push(`/workflows/${data.id}`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {upgradeComponent}
      <EntityHeader
        title="Workflows"
        description="Create and manage your workflows"
        newButtonLabel="New workflow"
        disabled={workflow.isPending}
        isCreating={workflow.isPending}
        onNew={handleCreateWorkflow}
      />
    </>
  );
};

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer header={<WorkflowHeader />} pagination={<></>} search={<></>}>
      {children}
    </EntityContainer>
  );
};
