//src/types/address.ts
export interface AddressRow {
  id: number | string;
  street: string;
  number: string;

  regionId: string;      // nombre región elegida
  communeId: string;     // nombre comuna elegida
  countyCode?: string;   // código Chilexpress

  postalCode?: string;
  references?: string;
}

export type NewAddress = Omit<AddressRow, "id">;
