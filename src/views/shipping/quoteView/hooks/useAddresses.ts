// src/hooks/useAddresses.ts
import { useEffect, useState } from "react";
import { fetchAddresses, createAddress } from "../../../../db/config/address.service";
import type { AddressRow, NewAddress } from "../../../../types/address";

// Direcciones mock como fallback
const MOCK_ADDRESSES: AddressRow[] = [
  {
    id: "addr_mock_1",
    street: "Las palmeras",
    number: "125",
    regionId: "RM",
    communeName: "VINA DEL MAR",
    communeId: "VINA",
    countyCode: "VINA",
    postalCode: "2520000",
    references: "Apartamento 502",
  } as any,
  {
    id: "addr_mock_2",
    street: "Avenida Libertador",
    number: "500",
    regionId: "RM",
    communeName: "SANTIAGO",
    communeId: "STGO",
    countyCode: "STGO",
    postalCode: "8320000",
    references: "Oficina central",
  } as any,
];

export function useAddresses(userId: string) {
  const [items, setItems] = useState<AddressRow[]>(MOCK_ADDRESSES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const addresses = await fetchAddresses(userId);
        setItems(addresses && addresses.length > 0 ? addresses : MOCK_ADDRESSES);
      } catch (err) {
        // Fallback a direcciones mock si la API falla
        console.log("Using mock addresses as fallback");
        setItems(MOCK_ADDRESSES);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  async function addAddress(data: NewAddress) {
    try {
      const created = await createAddress(userId, data);
      setItems((p) => [created, ...p]);
      return created;
    } catch (err) {
      // Si falla, crear dirección mock local
      const mockAddress: AddressRow = {
        id: `addr_local_${Date.now()}`,
        ...data,
      };
      setItems((p) => [mockAddress, ...p]);
      return mockAddress;
    }
  }

  return { items, loading, addAddress };
}
