// src/types/postal.ts

export interface QuoteRequest {
  // Ahora el front habla en códigos DPA (API Gobierno),
  // NO en códigos internos de Chilexpress.
  originCommuneId: string;
  destinationCommuneId: string;
  package: { weight: string; height: string; width: string; length: string };
  productType: number;
  contentType: number;
  declaredWorth: string;
  deliveryTime: number;
}

export interface QuoteOption {
  serviceCode: string;   // ej: "STND"
  serviceName: string;   // ej: "Estándar 48-72h"
  price: number;         // CLP
  currency: string;      // "CLP"
  etaDescription?: string;
}

export interface DeliveryCreate {
  addressId: string | number;
  quoteServiceCode: string;
  quotePrice: number;
  package: QuoteRequest["package"];
  meta?: Record<string, any>;
}
