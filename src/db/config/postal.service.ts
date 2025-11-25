// src/db/config/postal.service.ts

import type {
  QuoteRequest,
  QuoteOption,
} from "../../types/postal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

/**
 * Cotizar envío con Chilexpress
 * 
 * Todos los códigos deben ser countyCode de Chilexpress.
 * Obténgalos de: GET /geo/chilexpress/coverage-areas?regionCode=...
 */
export async function quoteShipping(body: QuoteRequest): Promise<QuoteOption[]> {
  const res = await fetch(`${API_BASE}/carriers/quote`, {
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
export async function createDelivery(payload: any): Promise<any> {
  const res = await fetch(`${API_BASE}/deliveries/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Error al crear envío (${res.status})`);
  }
  return res.json();
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
  return res.json();
}
