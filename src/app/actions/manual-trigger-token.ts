"use server";

import type { Realtime } from "@inngest/realtime";
import { getSubscriptionToken } from "@inngest/realtime";
import { manualTriggerChannel } from "@/inngest/channels/manual-trigger";
import { inngest } from "@/inngest/client";

type ManualTriggerToken = Realtime.Token<typeof manualTriggerChannel, ["status"]>;

export const fetchManualTriggerRealtimeToken = async (): Promise<ManualTriggerToken> => {
  const token = await getSubscriptionToken(inngest, {
    channel: manualTriggerChannel(),
    topics: ["status"],
  });

  return token;
};
