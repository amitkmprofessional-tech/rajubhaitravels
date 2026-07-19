import { connectDB } from "../../db/mongodb";

export const prerender = false;

export async function GET() {
  try {
    await connectDB();
    return new Response(JSON.stringify({ status: "ok", db: "connected" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Health check DB connection failed:", err);
    return new Response(
      JSON.stringify({ status: "error", db: "unreachable" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}
