import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { parseAsInteger, parseAsString } from "nuqs/server";
export const workflowParams = {
  page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE).withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};
