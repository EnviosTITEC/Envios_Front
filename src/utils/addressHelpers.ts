import type { AddressRow } from "../types/address";

/** Normaliza propiedad de comuna según shape de backend/local */
export function getCommune(address: AddressRow | any): string {
  return address.communeId ?? address.comune ?? address.commune ?? "";
}

/** Construye etiqueta legible de dirección */
export function labelOfAddress(a: AddressRow | any): string {
  const commune = getCommune(a);
  const street = a.street ?? a.streetName ?? "";
  const number = a.number ?? "";
  return `${street} ${number}${commune ? `, ${commune}` : ""}`;
}
