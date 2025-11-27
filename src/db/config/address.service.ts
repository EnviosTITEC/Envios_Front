//src/db/config/address.service.ts
import type { AddressRow, NewAddress } from "../../types/address";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

/* --- LocalStorage fallback helpers (useful cuando el backend no está) --- */
const storageKey = (userId: string) => `envios_addresses_${userId}`;

function readLocal(userId: string): AddressRow[] {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? (JSON.parse(raw) as AddressRow[]) : [];
  } catch (err) {
    console.warn("readLocal addresses error", err);
    return [];
  }
}

function writeLocal(userId: string, rows: AddressRow[]) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(rows));
  } catch (err) {
    console.warn("writeLocal addresses error", err);
  }
}

/** 🔹 Obtener todas las direcciones de un usuario */
export async function fetchAddresses(userId: string): Promise<AddressRow[]> {
  try {
    const res = await fetch(`${API_BASE}/addresses?userId=${encodeURIComponent(userId)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      // fallback a localStorage
      console.warn("fetchAddresses: backend responded", res.status, "- usando localStorage");
      return readLocal(userId);
    }

    return res.json();
  } catch (err) {
    // network failure -> local fallback
    console.warn("fetchAddresses network error, usando localStorage", err);
    return readLocal(userId);
  }
}

/** 🔹 Crear una nueva dirección */
export async function createAddress(userId: string, data: NewAddress): Promise<AddressRow> {
  const body = {
    street: data.street,
    number: data.number,
    communeId: data.communeId,
    regionId: data.regionId,
    countyCode: data.countyCode,
    postalCode: data.postalCode?.trim() || "",
    references: data.references?.trim() || "",
    userId,
  };

  console.log("Enviando payload:", body);

  try {
    const res = await fetch(`${API_BASE}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn("createAddress: backend responded", res.status, "- usando localStorage");
      const errorText = await res.text();
      console.error("Backend error response:", errorText);
      throw new Error("backend error");
    }

    return res.json();
  } catch (err) {
    // fallback: persistir en localStorage y devolver el objeto creado
    console.warn("createAddress fallback to localStorage", err);
    const rows = readLocal(userId);
    const created: AddressRow = {
      id: (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : `local-${Date.now()}`),
      street: data.street,
      number: data.number,
      regionId: data.regionId,
      communeId: data.communeId,
      countyCode: data.countyCode,
      postalCode: data.postalCode?.trim() || "",
      references: data.references?.trim() || "",
    };
    rows.unshift(created);
    writeLocal(userId, rows);
    return created;
  }
}

/** 🔹 Actualizar una dirección existente */
export async function updateAddress(id: number | string, data: Partial<NewAddress>): Promise<AddressRow> {
  try {
    const body = {
      street: data.street,
      number: data.number,
      communeId: data.communeId,
      regionId: data.regionId,
      countyCode: data.countyCode,
      postalCode: data.postalCode?.trim() || "",
      references: data.references?.trim() || "",
    };

    const res = await fetch(`${API_BASE}/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn("updateAddress: backend responded", res.status, "- usando localStorage");
      throw new Error("backend error");
    }

    return res.json();
  } catch (err) {
    // fallback local
    console.warn("updateAddress fallback to localStorage", err);
    // try to find which user owns this id in localStorage (scan keys)
    for (const key in localStorage) {
      if (!key.startsWith("envios_addresses_")) continue;
      try {
        const rows = JSON.parse(localStorage.getItem(key) || "[]") as AddressRow[];
        const idx = rows.findIndex(r => String(r.id) === String(id));
        if (idx >= 0) {
          const updated: AddressRow = { ...rows[idx], ...data } as AddressRow;
          rows[idx] = updated;
          localStorage.setItem(key, JSON.stringify(rows));
          return updated;
        }
      } catch (e) {
        /* ignore parse errors */
      }
    }
    throw new Error("Address not found locally");
  }
}

/** Eliminar una dirección */
export async function deleteAddress(id: number | string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/addresses/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.warn("deleteAddress: backend responded", res.status, "- usando localStorage");
      throw new Error("backend error");
    }

    return;
  } catch (err) {
    // fallback: remove from any localStorage user list where it exists
    console.warn("deleteAddress fallback to localStorage", err);
    for (const key in localStorage) {
      if (!key.startsWith("envios_addresses_")) continue;
      try {
        const rows = JSON.parse(localStorage.getItem(key) || "[]") as AddressRow[];
        const filtered = rows.filter(r => String(r.id) !== String(id));
        if (filtered.length !== rows.length) {
          localStorage.setItem(key, JSON.stringify(filtered));
          return;
        }
      } catch (e) {
        /* ignore parse errors */
      }
    }
    // if not found locally, just return
    return;
  }
}
