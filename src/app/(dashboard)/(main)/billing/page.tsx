import { requireAuth } from "@/lib/auth-utlis";

const Page = async () => {
  requireAuth();

  return (
    <div>
      <h1>Billing Page</h1>
    </div>
  );
};

export default Page;
