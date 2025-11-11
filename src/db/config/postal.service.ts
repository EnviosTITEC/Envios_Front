export type PostalCommune = { code: string; name: string };
export type PostalProvince = { code: string; name: string; communes: PostalCommune[] };
export type PostalRegion = { code: string; name: string; provinces: PostalProvince[] };

let _cache: PostalRegion[] | null = null;

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export async function getRegionsWithProvincesAndCommunes(): Promise<PostalRegion[]> {
  if (_cache) return _cache;
  const res = await fetch(`${API_BASE}/geo/cl/regions`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error obteniendo datos territoriales");
  const data = await res.json();
  _cache = data;
  return data;
}

/* ---------- NUEVO: cotizar ---------- */
import type { QuoteRequest, QuoteOption, DeliveryCreate } from "../../types/postal";

export async function quoteShipping(body: QuoteRequest): Promise<QuoteOption[]> {
  const res = await fetch(`${API_BASE}/shipping/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // Si tu backend aún no está, deja un mock amable
    console.warn("[quoteShipping] usando mock por HTTP ", res.status);
    return [
      { serviceCode: "STND", serviceName: "Estándar 48-72h", price: 4990, currency: "CLP", etaDescription: "2–3 días hábiles" },
      { serviceCode: "EXPR", serviceName: "Express 24h",     price: 7990, currency: "CLP", etaDescription: "1 día hábil" },
    ];
  }
  return res.json();
}

/* ---------- NUEVO: crear delivery ---------- */
export async function createDelivery(payload: DeliveryCreate): Promise<{ id: string }> {
  const res = await fetch(`${API_BASE}/deliveries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    // fallback blando si backend no está listo
    console.warn("[createDelivery] mock por HTTP ", res.status);
    return { id: crypto.randomUUID() };
  }
  return res.json();
}
