"use client";

import {
  EmptyStateView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorStateView,
  LoadingStateView,
} from "@/components/custom/entity-components";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { useUpgrade } from "../hooks/use-upgrade";
import { useCreateWorkflow, useRemoveWorkflow } from "../hooks/use-workflows";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { type workflow as WorkflowType } from "@/db/schemas/workflow-schema";
import { WorkflowIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    <EntityList
      items={workflows.items}
      renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
      getKey={(workflow) => workflow.id}
      emptyView={<WorkflowsListEmpty />}
    />
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

export const WorkflowsListError = () => {
  return <ErrorStateView message="Something went off the rail!!" />;
};

export const WorkflowsListLoading = () => {
  return <LoadingStateView message="Hold on! Loading workflows..." />;
};

export const WorkflowsListEmpty = () => {
  const workflow = useCreateWorkflow();
  const { handleError, upgradeComponent } = useUpgrade();

  const handleCreate = () => {
    workflow.mutate(undefined, {
      onError: (error) => {
        handleError(error);
      },
    });
  };

  return (
    <>
      {upgradeComponent}
      <EmptyStateView
        disabled={workflow.isPending}
        message="No workflows found. Create one now!"
        onNew={handleCreate}
      />
    </>
  );
};

type WorkflowItemProps = {
  workflow: typeof WorkflowType.$inferSelect;
};

export const WorkflowItem = ({ workflow }: WorkflowItemProps) => {
  const removeWorkflow = useRemoveWorkflow();

  const handleRemove = () => {
    removeWorkflow.mutate({ id: workflow.id });
  };

  return (
    <EntityItem
      href={`workflows/${workflow.id}`}
      title={workflow.name}
      subtitle={
        <span className="font-bold text-pretty text-muted-foreground">
          Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })} &bull;
          Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
        </span>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <WorkflowIcon className="size-6 text-muted-foreground" />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeWorkflow.isPending}
    />
  );
};
