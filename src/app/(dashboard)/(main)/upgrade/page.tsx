import { requireAuth } from "@/lib/auth-utlis";

const Page = async () => {
  requireAuth();

  return (
    <div>
      <h1>Upgrade Page</h1>
      <p>This is the upgrade page.</p>
    </div>
  );
};

export default Page;
