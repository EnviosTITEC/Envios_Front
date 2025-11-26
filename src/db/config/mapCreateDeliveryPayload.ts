// src/db/config/mapCreateDeliveryPayload.ts
// Mapper entre payload frontend (camelCase) y backend (snake_case en español)

// Frontend shape (camelCase)
export interface CreateDeliveryRequestFrontend {
  userId: string;
  sellerId: string;
  cartId: string;
  items?: Array<{ productId: string; name: string; quantity: number; price:number }>;
  paymentId?: string;
  package?: { weight:number; length:number; width:number; height:number };
  shippingInfo?: { originAddressId:string; destinationAddressId:string; carrierName:string; serviceType:string; estimatedCost:number };
  declaredWorth?: number;
  notes?: string;
}

// Backend shape (snake_case)
export interface CreateDeliveryRequestBackend {
  usuario_id: string;
  vendedor_id: string;
  carrito_id: string;
  pago_id: string;
  articulo_carrito: Array<{ producto_id:string; nombre:string; cantidad:number; precio:number }>;
  paquete?: { peso:number; largo:number; ancho:number; alto:number };
  informacion_envio?: { origen_direccion_id:string; destino_direccion_id:string; nombre_transportista:string; tipo_servicio:string; costo_estimado:number };
  valor_declarado?: number;
  notas?: string;
}

export function mapCreateDeliveryPayload(front: CreateDeliveryRequestFrontend): CreateDeliveryRequestBackend {
  return {
    usuario_id: String(front.userId ?? ""),
    vendedor_id: String(front.sellerId ?? ""),
    carrito_id: String(front.cartId ?? ""),
    pago_id: String(front.paymentId ?? "pendiente"),
    articulo_carrito: Array.isArray(front.items)
      ? front.items.map(it => ({
          producto_id: String(it.productId ?? ""),
          nombre: String(it.name ?? ""),
          cantidad: Number(it.quantity ?? 0),
          precio: Number(it.price ?? 0),
        }))
      : [],
    paquete: front.package ? {
      peso: Number(front.package.weight ?? 0),
      largo: Number(front.package.length ?? 0),
      ancho: Number(front.package.width ?? 0),
      alto: Number(front.package.height ?? 0),
    } : undefined,
    informacion_envio: front.shippingInfo ? {
      origen_direccion_id: String(front.shippingInfo.originAddressId ?? ""),
      destino_direccion_id: String(front.shippingInfo.destinationAddressId ?? ""),
      nombre_transportista: String(front.shippingInfo.carrierName ?? ""),
      tipo_servicio: String(front.shippingInfo.serviceType ?? ""),
      costo_estimado: Number(front.shippingInfo.estimatedCost ?? 0),
    } : undefined,
    valor_declarado: front.declaredWorth !== undefined ? Number(front.declaredWorth) : undefined,
    notas: front.notes,
  };
}

export default mapCreateDeliveryPayload;
