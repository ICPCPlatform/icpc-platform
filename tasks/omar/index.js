import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  try {
    console.log("Connecting to database...");
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    await client.connect();

    const insertQuery = `INSERT INTO "user" VALUES ('omar', 'hodsfh')`;
    const res = await client.query(insertQuery);
    console.log("Inserted User:", res.rows[0]);

    const users = await client.query('SELECT * FROM "user"');
    console.log("All Users:", users.rows);
  } catch (err) {
    console.error("Error:", err.stack);
  } finally {
    await client.end();
  }
}

run();
