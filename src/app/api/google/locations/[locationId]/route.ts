import { auth } from "@/auth";
import { getLocation, updateLocation } from "@/lib/google-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await params;

  try {
    const data = await getLocation(session.accessToken, locationId);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "API error" },
      { status: 502 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ locationId: string }> }
) {
  const session = await auth();
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { locationId } = await params;
  const body = await request.json();
  const { updates, updateMask } = body;

  if (!updates || !updateMask) {
    return NextResponse.json(
      { error: "updates and updateMask are required" },
      { status: 400 }
    );
  }

  try {
    const data = await updateLocation(
      session.accessToken,
      locationId,
      updates,
      updateMask
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "API error" },
      { status: 502 }
    );
  }
}
