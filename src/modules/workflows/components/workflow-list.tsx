"use client";

import {
  EntityContainer,
  EntityHeader,
  EntityPagination,
  EntitySearch,
} from "@/components/custom/entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useUpgrade } from "../hooks/use-upgrade";
import { useCreateWorkflow } from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";

export const WorkflowSearch = () => {
  const [params, setParams] = useWorkflowsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params: params,
    setParams: setParams,
    debounceMs: 2000,
  });

  return (
    <EntitySearch
      onChange={onSearchChange}
      value={searchValue}
      placeholder="Search workflows..."
    />
  );
};

export const WorkflowPagination = () => {
  const trpc = useTRPC();
  const [params, setParams] = useWorkflowsParams();

  const { data, isFetching } = useSuspenseQuery(
    trpc.workflows.getAll.queryOptions(params, { staleTime: Infinity }),
  );

  return (
    <EntityPagination
      onPageChange={(page) => setParams({ ...params, page })}
      page={params.page}
      totalPages={data.totalPages}
      disabled={isFetching}
    />
  );
};

export const WorkflowList = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  const { data: workflows } = useSuspenseQuery(
    trpc.workflows.getAll.queryOptions(params, { staleTime: Infinity }),
  );

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
    <EntityContainer
      header={<WorkflowHeader />}
      search={<WorkflowSearch />}
      pagination={<WorkflowPagination />}
    >
      {children}
    </EntityContainer>
  );
};
