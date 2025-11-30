// src/db/config/postal.service.ts

import type {
  QuoteRequest,
  QuoteOption,
} from "../../types/postal";
import axios from "axios";
import type { CreateDeliveryRequestFrontend } from "./mapCreateDeliveryPayload";
import { mapCreateDeliveryPayload } from "./mapCreateDeliveryPayload";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

/**
 * Cotizar envío con Chilexpress
 * 
 * Todos los códigos deben ser countyCode de Chilexpress.
 * Obténgalos de: GET /geo/chilexpress/coverage-areas?regionCode=...
 */
export async function quoteShipping(body: QuoteRequest): Promise<QuoteOption[]> {
  const res = await fetch(`${API_BASE}/quotes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Error HTTP ${res.status} al cotizar envío`);
  }

  const raw = await res.json();

  // Intentamos encontrar la lista de opciones en distintas formas posibles
  const options =
    raw?.courierServiceOptions ||
    raw?.data?.courierServiceOptions ||
    [];

  if (!Array.isArray(options)) return [];

  const mapped: QuoteOption[] = options.map((o: any) => ({
    serviceCode: o.serviceCode ?? o.serviceTypeCode ?? "",
    serviceName: o.serviceName ?? o.serviceDescription ?? "Servicio Chilexpress",
    // Chilexpress responde a veces con 'serviceValue' como string
    price: Number(
      o.finalPrice ?? o.totalAmountWithTaxes ?? o.shippingPrice ?? o.serviceValue ?? 0
    ) || 0,
    currency: "CLP",
    etaDescription: o.deliveryTypeName ?? o.deliveryEstimate ?? "",
  }));

  return mapped;
}

/**
 * Crear delivery después de cotización confirmada
 * Llama a: POST /api/deliveries/create
 */
export async function createDelivery(frontPayload: CreateDeliveryRequestFrontend): Promise<any> {
  // Mapear al formato que espera el backend (snake_case en español)
  const backendPayload = mapCreateDeliveryPayload(frontPayload);

  // Log para depuración antes de enviar
  console.log("[postal.service] Enviando payload al backend /deliveries/create:", backendPayload);

  try {
    const res = await axios.post(`${API_BASE}/deliveries/create`, backendPayload, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err: any) {
    // Si la API devuelve 400 (validación), reenviamos el error para que el hook lo maneje y guarde localmente
    if (err?.response && err.response.status === 400) {
      // Re-lanzar el error para manejo upstream
      throw err;
    }
    // Para otros errores también re-lanzamos (se puede ajustar comportamiento si se desea)
    throw err;
  }
}

/**
 * Obtener todos los envíos de un usuario
 * Llama a: GET /api/deliveries/user/{userId}
 */
export async function getUserDeliveries(userId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/deliveries/user/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Error al obtener envíos (${res.status})`);
  }
  const deliveries = await res.json();
  // Mapear cada envío a la estructura esperada por el frontend
  return deliveries.map((d: any) => ({
    _id: d._id,
    trackingNumber: d.numero_seguimiento,
    status: d.estado,
    shippingInfo: {
      estimatedCost: d.costo_estimado ?? d.costo ?? d.costo_estimado,
      serviceType: d.tipo_servicio ?? d.shipping_service ?? d.serviceType,
      originAddressId: d.origen_direccion_id,
      destinationAddressId: d.destino_direccion_id,
      carrierName: "Chilexpress",
      street: d.calle ?? d.street ?? "",
      number: d.numero ?? d.number ?? "",
    },
    items: (d.articulos || d.articulo_carrito || []).map((item: any) => ({
      name: item.nombre ?? item.name ?? "",
      quantity: item.cantidad ?? item.quantity ?? "",
      price: item.precio ?? item.price ?? "",
      productId: item.producto_id ?? item.productId ?? "",
    })),
    package: {
      weight: d.peso ?? d.paquete?.peso ?? d.dimensiones?.peso,
      length: d.paquete?.largo ?? d.dimensiones?.largo,
      width: d.paquete?.ancho ?? d.dimensiones?.ancho,
      height: d.paquete?.alto ?? d.dimensiones?.alto,
    },
    createdAt: d.createdAt,
    selectedProduct: undefined,
    selectedOption: {
      etaDescription: d.fecha_entrega_estimada
        ? new Date(d.fecha_entrega_estimada).toLocaleDateString("es-CL", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—"
    },
    destinationAddress: {
      street: d.calle ?? d.street ?? "",
      number: d.numero ?? d.number ?? "",
      communeName: d.comuna_id ?? d.communeName ?? "",
      regionId: d.region_id ?? d.regionId ?? "",
    },
    paymentId: d.pago_id ?? d.paymentId,
    notes: d.notas,
    declaredWorth: d.valor_declarado,
  }));
}

/**
 * Actualizar estado de un delivery
 * Llama a: PATCH /api/deliveries/:id
 */
export async function updateDeliveryStatus(deliveryId: string, status: string): Promise<any> {
  const res = await fetch(`${API_BASE}/deliveries/${deliveryId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Error al actualizar envío (${res.status})`);
  }

  return res.json();
}

/**
 * Eliminar un delivery por id en el backend
 */
export async function deleteDelivery(deliveryId: string): Promise<any> {
  const url = `${API_BASE}/deliveries/${deliveryId}`;
  try {
    const res = await axios.delete(url, { headers: { "Content-Type": "application/json" } });
    return res.data;
  } catch (err: any) {
    // Re-lanzar para manejo upstream
    throw err;
  }
}
