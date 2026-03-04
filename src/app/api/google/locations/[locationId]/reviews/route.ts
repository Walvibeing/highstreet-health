import { auth } from "@/auth";
import { listReviews } from "@/lib/google-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await params;
  const accountId = request.nextUrl.searchParams.get("accountId");
  const pageToken = request.nextUrl.searchParams.get("pageToken") || undefined;

  if (!accountId) {
    return NextResponse.json(
      { error: "accountId is required" },
      { status: 400 }
    );
  }

  try {
    const data = await listReviews(
      session.accessToken,
      accountId,
      locationId,
      50,
      pageToken
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "API error" },
      { status: 502 }
    );
  }
}
