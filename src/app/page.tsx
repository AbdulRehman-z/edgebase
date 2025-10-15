import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth-utlis";

const Home = async () => {
  await requireAuth();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button>Click Me!</Button>
    </div>
  );
};

export default Home;
