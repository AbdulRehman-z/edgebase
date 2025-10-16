import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schemas/auth-schema";
import * as workflowSchema from "./schemas/workflow-schema";

const schema = {
  ...authSchema,
  ...workflowSchema,
};

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });

export const { account, session, user, verification, workflow } = schema;
