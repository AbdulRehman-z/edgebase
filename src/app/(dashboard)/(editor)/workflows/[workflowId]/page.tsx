import { requireAuth } from "@/lib/auth-utlis";

type Props = {
  workflowId: Promise<{ workflowId: string }>;
};

const Page = async ({ workflowId }: Props) => {
  await requireAuth();

  const { workflowId: id } = await workflowId;

  return (
    <div>
      <h1>Workflow {id}</h1>
    </div>
  );
};

export default Page;
