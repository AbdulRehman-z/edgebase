export const NODE_TYPES = ["INITIAL", "HTTP_REQUEST", "MANUAL_TRIGGER"] as const;

export type NodeType = (typeof NODE_TYPES)[number];

export const NodeTypesCustom = {
  INITIAL: "INITIAL" as const,
  HTTP_REQUEST: "HTTP_REQUEST" as const,
  MANUAL_TRIGGER: "MANUAL_TRIGGER" as const,
} as const;
