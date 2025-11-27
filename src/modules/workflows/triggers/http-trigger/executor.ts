import { NonRetriableError } from "inngest";
import ky, { Options as kyOption } from "ky";
import type { NodeExecutor } from "../../lib/types";

type HttpRequestData = {
  variableName: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint?: string;
  body?: string;
};

export const httpTriggerExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: no endpoint configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError("HTTP Request node: no variable name configured");
  }

  const endpoint = data.endpoint;
  const method = data.method || "GET";
  const body = data.body;

  const result = await step.run("http-request", async () => {
    const options: kyOption = { method };

    if (["POST", "PUT", "DELETE"].includes(method)) {
      options.body = body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("Content-Type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      [data.variableName]: {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
      },
    };
  });

  return result;
};
