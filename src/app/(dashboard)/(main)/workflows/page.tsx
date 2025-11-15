import { requireAuth } from "@/lib/auth-utlis";
import {
  WorkflowList,
  WorkflowsContainer,
  WorkflowsListError,
  WorkflowsListLoading,
} from "@/modules/workflows/components/workflow-list";
import { workflowsParamsLoader } from "@/modules/workflows/server/params-loader";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const queryClient = getQueryClient();
  const params = await workflowsParamsLoader(searchParams);

  void queryClient.prefetchQuery(
    trpc.workflows.getAll.queryOptions(params, {
      staleTime: Infinity,
    }),
  );

  return (
    <WorkflowsContainer>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ErrorBoundary fallback={<WorkflowsListError />}>
          <Suspense fallback={<WorkflowsListLoading />}>
            <WorkflowList />
          </Suspense>
        </ErrorBoundary>
      </HydrationBoundary>
    </WorkflowsContainer>
  );
};

export default Page;
