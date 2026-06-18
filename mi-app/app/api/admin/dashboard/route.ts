import { NextResponse } from "next/server";

export async function GET() {
  const secret = process.env.BUYER_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "BUYER_SECRET no configurado" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      "https://proyecto-c-buyer-dev-squad.vercel.app/api/admin/dashboard",
      {
        headers: { "buyer-key": secret },
        next: { revalidate: 60 },
      }
    );

    if (res.status === 403) {
      return NextResponse.json(
        { error: "Clave inválida - BUYER_SECRET incorrecto" },
        { status: 403 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Error del servidor externo: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error de conexión con el servidor externo" },
      { status: 502 }
    );
  }
}
