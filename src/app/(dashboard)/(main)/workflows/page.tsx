import { requireAuth } from "@/lib/auth-utlis";
import {
  WorkflowList,
  WorkflowsContainer,
} from "@/modules/workflows/components/workflow-list";
import { workflowsParamsLoader } from "@/modules/workflows/server/params-loader";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { Suspense } from "react";

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
        <Suspense fallback={<div>Loading workflows...</div>}>
          <WorkflowList />
        </Suspense>
      </HydrationBoundary>
    </WorkflowsContainer>
  );
};

export default Page;
