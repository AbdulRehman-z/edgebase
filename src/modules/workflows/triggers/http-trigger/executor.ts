import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "../../lib/types";
import ky, { Options as kyOption } from "ky";

type HttpRequestData = {
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

  const endpoint = data.endpoint;
  const method = data.method || "GET";
  const body = data.body;

  const result = await step.run("http-request", async () => {
    const options: kyOption = { method };

    if (["POST", "PUT", "DELETE"].includes(method)) {
      options.body = body;
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("Content-Type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    return {
      ...context,
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        body: responseData,
      },
    };
  });

  return result;
};
