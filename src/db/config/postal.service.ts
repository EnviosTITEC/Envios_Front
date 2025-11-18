// src/db/config/postal.service.ts

import type {
  QuoteRequest,
  QuoteOption,
  DeliveryCreate,
} from "../../types/postal";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

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
    price:
      o.finalPrice ??
      o.totalAmountWithTaxes ??
      o.shippingPrice ??
      0,
    currency: "CLP",
    etaDescription: o.deliveryTypeName ?? o.deliveryEstimate ?? "",
  }));

  return mapped;
}

/**
 * Crear delivery después de cotización confirmada
 */
export async function createDelivery(
  payload: DeliveryCreate,
): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/deliveries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.warn("[createDelivery] mock por HTTP ", res.status);
    return { id: crypto.randomUUID() };
  }
  return res.json();
}
