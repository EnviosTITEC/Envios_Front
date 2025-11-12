// src/hooks/useAddresses.ts
import { useEffect, useState } from "react";
import { fetchAddresses, createAddress } from "../../../../db/config/address.service";
import type { AddressRow, NewAddress } from "../../../../types/address";

export function useAddresses(userId: string) {
  const [items, setItems] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setItems(await fetchAddresses(userId));
      } catch {
        setError("No se pudieron cargar las direcciones");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  async function addAddress(data: NewAddress) {
    const created = await createAddress(userId, data);
    setItems((p) => [created, ...p]);
    return created;
  }

  return { items, loading, error, addAddress };
}
