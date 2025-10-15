import { auth } from "@/lib/auth";
import { LoginForm } from "@/modules/auth/components/login-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }

  return <LoginForm />;
};

export default Page;
