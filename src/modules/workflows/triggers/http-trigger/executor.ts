import HandleBars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { Options as kyOption } from "ky";
import type { NodeExecutor } from "../../lib/types";

type HttpRequestData = {
  variableName: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  body?: string;
};

HandleBars.registerHelper("json", (context) => {
  try {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new HandleBars.SafeString(jsonString);
    return safeString;
  } catch (error) {
    console.error(error);
    throw new NonRetriableError("HTTP Request node: error parsing JSON");
  }
});

export const httpTriggerExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("HTTP Request node: no endpoint configured");
  }

  if (!data.variableName) {
    throw new NonRetriableError("HTTP Request node: no variable name configured");
  }

  if (!data.method) {
    throw new NonRetriableError("HTTP Request node: no method configured");
  }

  let endpoint: string;
  try {
    const compiledEndpoint = HandleBars.compile(data.endpoint)(context);
    if (!compiledEndpoint || typeof compiledEndpoint !== "string") {
      throw new NonRetriableError("Endpoint template must resolve to a non-empty string");
    }
    endpoint = compiledEndpoint;
  } catch (error) {
    console.error(error);
    throw new NonRetriableError("HTTP Request node: error compiling endpoint");
  }

  const method = data.method || "GET";
  const result = await step.run("http-request", async () => {
    const options: kyOption = { method };

    if (["POST", "PUT", "DELETE"].includes(method)) {
      options.body = HandleBars.compile(data.body || "{}")(context);
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const response = await ky(endpoint, options);
    const contentType = response.headers.get("Content-Type");

    const responseData = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    const responsePayload = {
      httpResponse: {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [data.variableName]: responsePayload,
    };
  });

  return result;
};
