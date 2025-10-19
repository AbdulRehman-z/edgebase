import { requireAuth } from "@/lib/auth-utlis";

type Props = {
  executionId: Promise<{ executionId: string }>;
};

const Page = async ({ executionId }: Props) => {
  await requireAuth();

  const { executionId: id } = await executionId;

  return (
    <div>
      <h1>Execution {id}</h1>
    </div>
  );
};

export default Page;
