import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  schema: './app/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['personal_website'],
  dbCredentials: {
    url: process.env.POSTGRES_CONNECTION_STRING!,
  },
});
