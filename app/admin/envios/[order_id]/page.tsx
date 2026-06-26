import EnvioDetalleClient from "./EnvioDetalleClient";

export default async function EnvioDetallePage({
  params,
}: {
  params: Promise<{ order_id: string }>;
}) {
  const { order_id } = await params;
  return <EnvioDetalleClient orderId={order_id} />;
}