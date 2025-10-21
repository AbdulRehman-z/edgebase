import { requireAuth } from "@/lib/auth-utlis";

type Props = {
  params: Promise<{ workflowId: string }>;
};

const Page = async ({ params }: Props) => {
  await requireAuth();

  const { workflowId } = await params;

  return (
    <div>
      <h1>Workflow {workflowId}</h1>
    </div>
  );
};

export default Page;
