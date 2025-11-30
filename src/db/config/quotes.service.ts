// src/db/config/quotes.service.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";

export async function saveQuoteRecord(quote: any): Promise<any> {
  // Guarda el JSON recibido en la tabla quotes
  const res = await axios.post(`${API_BASE}/quotes/record`, quote, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
}
