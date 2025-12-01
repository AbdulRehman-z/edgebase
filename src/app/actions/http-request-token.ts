"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";
import { httpRequestChannel } from "@/inngest/channels/http-requests";
import { inngest } from "@/inngest/client";

type HttpRequestToken = Realtime.Token<typeof httpRequestChannel, ["status"]>;

export const fetchHttpRequestRealtimeToken = async (): Promise<HttpRequestToken> => {
  const token = await getSubscriptionToken(inngest, {
    channel: httpRequestChannel(),
    topics: ["status"],
  });

  return token;
};
