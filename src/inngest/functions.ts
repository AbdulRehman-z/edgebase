import { db, workflow } from "@/db";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");

    await step.sleep("wait-a-moment", "1s");

    await step.sleep("wait-a-moment", "5s");

    await step.sleep("wait-a-moment", "2s");

    await step.run("saving-message", async () => {
      await db.insert(workflow).values({
        name: "my-whatsapp-message",
      });
    });

    return { message: `Hello ${event.data.email}!` };
  },
);
