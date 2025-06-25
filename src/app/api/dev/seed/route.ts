import { ensureDefaultUsers } from "@/devtools/seedUsers";

export async function GET() {
  if (process.env.DEV_TOOLS !== "true") {
    return new Response(JSON.stringify({ error: "Not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const results = await ensureDefaultUsers();
  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
} 