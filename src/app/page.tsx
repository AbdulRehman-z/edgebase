"use client";

import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utlis";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Home = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkFlows.queryOptions());
  const { mutate: createWorkflow } = useMutation(
    trpc.createWorkflow.mutationOptions({
      onSuccess: (data) => {
        toast.success(data.message);
      },
    }),
  );

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button onClick={() => createWorkflow()}>Create workflow</Button>
      {JSON.stringify(data, null, 2)}
    </div>
  );
};

export default Home;
