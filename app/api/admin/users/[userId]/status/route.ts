import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_SUPERADMIN_KEY
const SELLER_API = process.env.NEXT_PUBLIC_SELLER_APP_URL
const BUYER_API = process.env.BUYER_API_URL

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const clerkId = (await params).userId;
    const { status, role } = await req.json();
    const cookie = req.headers.get("cookie") || "";

    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be ACTIVE or SUSPENDED" },
        { status: 400 }
      );
    }

    if (role === "seller") {
      const active = status === "ACTIVE";
      const response = await fetch(
        `${SELLER_API}/api/admin/vendedores`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "X-Superadmin-Key": API_KEY!,
          },
          body: JSON.stringify({
            clerkId,
            active,
          }),
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.error || "Error actualizando vendedor" },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        active: data.active,
      });
    }

    const response = await fetch(
      `${BUYER_API}/api/admin/users/${clerkId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "buyer-key": process.env.BUYER_API_KEY || "",
          cookie,
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
