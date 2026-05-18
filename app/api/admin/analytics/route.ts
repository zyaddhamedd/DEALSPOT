import { NextResponse } from "next/server";
import { getAdminAnalytics } from "@/src/lib/server/admin-analytics";

export async function GET() {
  try {
    const stats = await getAdminAnalytics();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Admin Analytics GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
