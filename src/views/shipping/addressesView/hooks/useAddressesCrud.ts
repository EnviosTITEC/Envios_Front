import { useEffect, useState, useCallback } from "react";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../../../../db/config/address.service";
import type { AddressRow, NewAddress } from "../../../../types/address";

export function useAddressesCrud(userId: string) {
  const [items, setItems] = useState<AddressRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchAddresses(userId);
      setItems(data);
      setError("");
    } catch (e: any) {
      setError(e?.message ?? "Error cargando direcciones");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { void load(); }, [load]);

  async function add(data: NewAddress) {
    const created = await createAddress(userId, data);
    setItems((prev) => [created, ...prev]);
    return created;
  }

  async function edit(id: string | number, data: NewAddress) {
    const updated = await updateAddress(id, data);
    setItems((prev) => prev.map((r) => {
      const rid = (r as any)._id ?? (r as any).id;
      return rid === id ? updated : r;
    }));
    return updated;
  }

  async function remove(id: string | number) {
    await deleteAddress(id);
    setItems((prev) => prev.filter((r) => {
      const rid = (r as any)._id ?? (r as any).id;
      return rid !== id;
    }));
  }

  return { items, loading, error, load, add, edit, remove };
}
