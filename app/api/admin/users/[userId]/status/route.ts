import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.SUPERADMIN_KEY
const SELLER_API = process.env.NEXT_PUBLIC_SELLER_APP_URL


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { status, role } = await req.json();

    if (!status || !["ACTIVE", "SUSPENDED"].includes(status)) {
      return NextResponse.json(
        { error: "Status must be ACTIVE or SUSPENDED" },
        { status: 400 }
      );
    }
    const active = status === "ACTIVE";


   if (role === "seller") {
          const response = await fetch(
      `${SELLER_API}/api/admin/vendedores`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Superadmin-Key": API_KEY!,
        },
        body: JSON.stringify({
          id: userId,
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
      `https://zapasya.vercel.app/api/admin/users/${userId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'buyer-key': process.env.BUYER_API_KEY || '',
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
