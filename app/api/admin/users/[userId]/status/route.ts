import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { status } = await req.json();

    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be ACTIVE or SUSPENDED" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://zapasya.vercel.app/api/admin/users/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "buyer-dev-squad",
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Error al actualizar el estado" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar el estado del usuario" },
      { status: 502 }
    );
  }
}
