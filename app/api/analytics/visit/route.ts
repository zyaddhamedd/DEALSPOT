import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { analyticsVisits } from "@/src/db/schema";
import { and, eq, gte } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { visitorId, pathname, referrer } = await request.json();

    if (!visitorId || !pathname) {
      return NextResponse.json({ error: "Missing visitorId or pathname" }, { status: 400 });
    }

    // 1. Prevent duplicate spam: check if this visitor has visited this pathname in the last 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const duplicate = await db.query.analyticsVisits.findFirst({
      where: and(
        eq(analyticsVisits.visitorId, visitorId),
        eq(analyticsVisits.pathname, pathname),
        gte(analyticsVisits.createdAt, fifteenMinutesAgo)
      ),
    });

    if (duplicate) {
      return NextResponse.json({ success: true, message: "Duplicate visit within TTL bypassed.", duplicated: true });
    }

    // 2. Extract user agent from request headers
    const userAgent = request.headers.get("user-agent") || "";

    // 3. Record visit in PostgreSQL
    await db.insert(analyticsVisits).values({
      visitorId,
      pathname,
      userAgent,
      referrer: referrer || "",
    });

    return NextResponse.json({ success: true, message: "Visit logged successfully", duplicated: false });
  } catch (error) {
    console.error("Visit tracking failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
