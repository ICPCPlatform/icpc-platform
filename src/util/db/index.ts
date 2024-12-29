import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema/user';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});

// Test the connection
pool.connect()
    .then(() => {
        console.log('🚀 Connected to PostgreSQL database');
        console.log('📍 Database URL:', process.env.DATABASE_URL?.split('@')[1]); // Only show host part for security
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err.message);
    });

export const db = drizzle(pool, { schema });
