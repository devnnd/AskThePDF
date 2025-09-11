import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if(!process.env.DATABASE_URL){
    throw new Error("DATABASE_URL not defined.")
}

// neon() returns a Neon-specific query function that is used to execute raw SQL statements
const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql);