import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schemas/auth-schema";

const schema = {
  ...authSchema,
};

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema });

export const { account, session, user, verification } = schema;
