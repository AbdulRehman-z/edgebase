import * as serverless from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schemas/auth-schema";
import * as workflowSchema from "./schemas/workflow-schema";

const schema = {
  ...authSchema,
  ...workflowSchema,
};

serverless.defaults.query_timeout = 10000;
const sql = serverless.neon(process.env.DATABASE_URL as string);
export const db = drizzle({ client: sql, schema });

export const {
  account,
  session,
  user,
  verification,
  workflow,
  connection,
  node,
  nodeTypeEnum,
} = schema;
