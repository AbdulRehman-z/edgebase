import { Editor, EditorError, EditorLoading } from "@/components/editor/editor";
import { EditorHeader } from "@/components/editor/editor-header";
import { requireAuth } from "@/lib/auth-utlis";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
  params: Promise<{ workflowId: string }>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();
  const { workflowId } = await params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.workflows.getOne.queryOptions(
      { id: parseInt(workflowId) },
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
