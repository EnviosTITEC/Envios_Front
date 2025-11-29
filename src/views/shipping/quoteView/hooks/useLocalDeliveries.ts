// Hook para manejar envíos almacenados localmente (simulado)
// import { useEffect, useState } from "react";
import { createDelivery as createDeliveryBackend } from "../../../../db/config/postal.service";

export interface LocalDelivery {
  _id: string;
  trackingNumber: string;
  status: string;
  shippingInfo: {
    estimatedCost: number;
    serviceType: string;
    originAddressId: string;
    destinationAddressId: string;
    street?: string;
    number?: string;
  };
  items: any[];
  package: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  selectedProduct?: any;
  selectedOption?: any;
  destinationAddress?: any;
  paymentId?: string;
}


export function useLocalDeliveries() {

  // Agregar nuevo envío SOLO en backend
  const addDelivery = async (delivery: Omit<LocalDelivery, "_id" | "trackingNumber" | "createdAt">) => {
    // Construir payload con la estructura esperada por el backend
    const backendDeliveryPayload = {
      userId: "user_456", // TODO: Reemplazar por contexto de usuario real
      sellerId: delivery.shippingInfo?.originAddressId || "seller_789",
      cartId: `cart-${Date.now()}`,
      paymentId: (delivery as any).paymentId ?? "pendiente",
      items: (delivery.items || []).map((it: any) => ({
        productId: it.productId ?? it.id ?? it.productId,
        name: it.name,
        quantity: it.quantity,
        price: it.price,
      })),
      package: {
        weight: Number(delivery.package?.weight ?? 0),
        length: Number(delivery.package?.length ?? 0),
        width: Number(delivery.package?.width ?? 0),
        height: Number(delivery.package?.height ?? 0),
      },
      shippingInfo: {
        originAddressId: delivery.shippingInfo?.originAddressId || "addr_origin_123",
        destinationAddressId: delivery.shippingInfo?.destinationAddressId || "addr_dest_456",
        carrierName: "Chilexpress",
        serviceType: delivery.shippingInfo?.serviceType || delivery.selectedOption?.serviceName || "EXPRESS",
        estimatedCost: Number(delivery.shippingInfo?.estimatedCost ?? 0),
        street: delivery.shippingInfo?.street || delivery.destinationAddress?.street || "",
        number: delivery.shippingInfo?.number || delivery.destinationAddress?.number || "",
      },
      declaredWorth: Number(
        (delivery as any).declaredWorth ??
          (delivery.items || []).reduce((sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0)
      ),
      notes: (delivery as any).notes ?? "Creado desde frontend",
    };

    // Enviar al backend usando el helper común
    const savedDelivery = await createDeliveryBackend(backendDeliveryPayload);
    if (savedDelivery) {
      // Preferir el trackingNumber/id que retorne el backend
      const trackingNumber = savedDelivery.trackingNumber;
      const backendId = savedDelivery._id ?? savedDelivery.id;
      const newDeliveryFromBackend: LocalDelivery = {
        ...delivery,
        _id: backendId ? String(backendId) : `local_${Date.now()}`,
        trackingNumber,
        createdAt: savedDelivery.createdAt ?? new Date().toISOString(),
      };
      // Opcional: podrías actualizar el estado local si lo deseas
      return newDeliveryFromBackend;
    } else {
      throw new Error("No se pudo crear el envío en el backend");
    }
  };

  return {
    addDelivery,
  };
}
