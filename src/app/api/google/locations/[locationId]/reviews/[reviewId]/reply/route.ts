import { auth } from "@/auth";
import { replyToReview } from "@/lib/google-api";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  {
    params,
  }: { params: Promise<{ locationId: string; reviewId: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId, reviewId } = await params;
  const body = await request.json();
  const { comment, accountId } = body;

  if (!comment || !accountId) {
    return NextResponse.json(
      { error: "comment and accountId are required" },
      { status: 400 }
    );
  }

  try {
    const data = await replyToReview(
      session.accessToken,
      accountId,
      locationId,
      reviewId,
      comment
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "API error" },
      { status: 502 }
    );
  }
}
