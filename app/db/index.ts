import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_CONNECTION_STRING,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });
