import { requireAuth } from "@/lib/auth-utlis";

type Props = {
  credentialId: Promise<{ credentialId: string }>;
};

const Page = async ({ credentialId }: Props) => {
  await requireAuth();
  const { credentialId: id } = await credentialId;

  return (
    <div>
      <h1>Credential {id}</h1>
    </div>
  );
};

export default Page;
