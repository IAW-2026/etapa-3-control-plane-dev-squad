// types.ts
export type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: number;
  color: string | null;
  imageUrl: string | null;
  productOriginAddress: string | null;
};

export type Shipment = {
  id: number;
  orderId: string;
  buyerId: string;
  status: string;
  address: string;
  carrier: string;
  shippingCost: number | null;
  discount: number;
  estimatedDeliveryDate: string | null;
  deliveryDate: string | null;
  createdAt: string;
  items: OrderItem[];
};

export type TrackingItem = {
  id: number;
  status: string;
  description: string | null;
  location: string;
  timestamp: string;
};