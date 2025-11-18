// src/views/shipping/quoteView/hooks/useQuote.ts
import { useState } from "react";
import {
  quoteShipping,
  createDelivery,
} from "../../../../db/config/postal.service";
import type { QuoteOption } from "../../../../types/postal";

export function useQuote() {
  const [quotes, setQuotes] = useState<QuoteOption[]>([]);
  const [selected, setSelected] = useState<QuoteOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // req = DeliveryDto que definimos en el backend
  async function getQuote(req: any) {
    setError("");
    setSelected(null);
    setQuotes([]);
    setLoading(true);
    try {
      const opts = await quoteShipping(req);
      setQuotes(opts);
      if (!opts.length) setError("No hay opciones para esta ruta.");
    } catch (e: any) {
      setError(e?.message || "Error al calcular cotización.");
    } finally {
      setLoading(false);
    }
  }

  async function createDeliveryFrom(selection: any) {
    return createDelivery(selection);
  }

  return {
    quotes,
    selected,
    setSelected,
    loading,
    error,
    getQuote,
    createDeliveryFrom,
    setError,
  };
}
