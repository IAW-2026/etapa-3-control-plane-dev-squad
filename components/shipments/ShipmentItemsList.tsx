type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: number;
  color: string | null;
  imageUrl: string | null;
  productOriginAddress: string | null;
};

export function ShipmentItemsList({
  items,
  shippingCost,
  discount,
}: {
  items: OrderItem[];
  shippingCost: number | null;
  discount: number | null;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = subtotal + (shippingCost ?? 0) - (discount ?? 0);

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="text-sm font-semibold px-5 py-4 border-b border-border">
        Productos del pedido
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="px-5 py-4 flex gap-4">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain" />
              ) : (
                <span className="text-2xl">👟</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">{item.name}</div>
              {/* Dejamos únicamente Talle, Color y Cantidad */}
              <div className="text-xs opacity-60 mt-0.5">
                Talle {item.size}{item.color ? ` · ${item.color}` : ""} · x{item.quantity}
              </div>
            </div>
            <div className="text-sm font-semibold whitespace-nowrap">
              ${item.price.toLocaleString("es-AR")}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-border space-y-2">
        <div className="flex justify-between text-sm">
          <span className="opacity-60">Subtotal</span>
          <span>${subtotal.toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="opacity-60">Envío</span>
          <span>
            {shippingCost == null
              ? "—"
              : shippingCost === 0
              ? "Gratis"
              : `$${shippingCost.toLocaleString("es-AR")}`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="opacity-60">Descuento</span>
          <span>-${(discount ?? 0).toLocaleString("es-AR")}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
          <span>Total</span>
          <span>${total.toLocaleString("es-AR")}</span>
        </div>
      </div>
    </div>
  );
}