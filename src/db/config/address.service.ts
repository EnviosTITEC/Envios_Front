import type { AddressRow, NewAddress } from "../../types/address";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/** 🔹 Obtener todas las direcciones de un usuario */
export async function fetchAddresses(userId: string): Promise<AddressRow[]> {
  const res = await fetch(
    `${API_BASE}/addresses?userId=${encodeURIComponent(userId)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error(`Error al obtener direcciones: ${res.status}`);
  }

  return res.json();
}

/** 🔹 Crear una nueva dirección */
export async function createAddress(
  userId: string,
  data: NewAddress
): Promise<AddressRow> {
  const body = {
    street: data.street,
    number: data.number,
    comune: data.communeId,
    province: data.provinceId,
    region: data.regionId,
    postalCode: data.postalCode?.trim() || "", // ← limpio y opcional
    references: data.references?.trim() || "",
    userId,
  };

  const res = await fetch(`${API_BASE}/addresses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Error al crear dirección: ${res.status}`);
  }

  return res.json();
}

/** 🔹 Actualizar una dirección existente */
export async function updateAddress(
  id: number | string,
  data: Partial<NewAddress>
): Promise<AddressRow> {
  const body = {
    street: data.street,
    number: data.number,
    comune: data.communeId,
    province: data.provinceId,
    region: data.regionId,
    postalCode: data.postalCode?.trim() || "",
    references: data.references?.trim() || "",
  };

  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`Error al actualizar dirección: ${res.status}`);
  }

  return res.json();
}

/** 🔹 Eliminar una dirección */
export async function deleteAddress(id: number | string): Promise<void> {
  const res = await fetch(`${API_BASE}/addresses/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Error al eliminar dirección: ${res.status}`);
  }
}
