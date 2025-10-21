import { requireAuth } from "@/lib/auth-utlis";
import {
  WorkflowList,
  WorkflowsContainer,
} from "@/modules/workflows/components/workflow-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async () => {
  await requireAuth();

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.workflows.getAll.queryOptions());

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
