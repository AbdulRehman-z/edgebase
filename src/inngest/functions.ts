import { db, workflow } from "@/db";
import { inngest } from "./client";
import { createOpenAI } from "@ai-sdk/openai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";

import { generateText } from "ai";

const openai = createOpenAI();
const google = createGoogleGenerativeAI();
const anthropic = createAnthropic();

export const executeAi = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.ai.wrap("running-gemini", generateText, {
      model: google("gemini-2.5-flash"),
      maxRetries: 1,
      system: "You are a helpful assistant.",
      prompt:
        "Help me write a function that takes in a string and returns the string in reverse order.",
    });

    await step.ai.wrap("running-openai", generateText, {
      model: openai("gpt-4.1"),
      maxRetries: 1,
      system: "You are a helpful assistant.",
      prompt:
        "Help me write a function that takes in a string and returns the string in reverse order.",
    });

    await step.ai.wrap("running-anthropic", generateText, {
      model: anthropic("gemini-2.5-flash"),
      maxRetries: 1,
      system: "You are a helpful assistant.",
      prompt:
        "Help me write a function that takes in a string and returns the string in reverse order.",
    });

    return { message: `Hello ${event.data.email}!` };
  },
);
