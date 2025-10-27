export interface AddressRow {
  id: number | string;
  street: string;
  number: string;

  regionId: string;    // nombre región elegida
  provinceId: string;  // nombre provincia elegida
  communeId: string;   // nombre comuna elegida

  postalCode?: string;
  references?: string;
}

export type NewAddress = Omit<AddressRow, "id">;
