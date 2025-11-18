// src/types/postal.ts

export interface QuoteRequest {
  originCountyCode: string;      // Código Chilexpress (ej: "STGO")
  destinationCountyCode: string; // Código Chilexpress (ej: "VAP")
  package: {
    weight: string;    // kg
    height: string;    // cm
    width: string;     // cm
    length: string;    // cm
  };
  productType: number;      // 1 = Documento, 3 = Encomienda
  contentType: number;      // Tipo de contenido
  declaredWorth: string;    // Valor declarado en CLP
  deliveryTime: number;     // 0 = Todos los servicios
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
