import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Editor, EditorError, EditorLoading } from "@/components/editor/editor";
import { EditorHeader } from "@/components/editor/editor-header";
import { requireAuth } from "@/lib/auth-utlis";
import { getQueryClient, trpc } from "@/trpc/server";

const Page = async (props: PageProps<"/workflows/[workflowId]">) => {
  await requireAuth();
  const { workflowId } = await props.params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.workflows.getOne.queryOptions(
      { id: parseInt(workflowId, 10) },
      {
        staleTime: Infinity,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <main className="flex-1">
            <Editor workflowId={workflowId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default Page;
