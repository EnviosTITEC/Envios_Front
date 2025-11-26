// Hook para manejar envíos almacenados localmente (simulado)
import { useEffect, useState } from "react";
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

const STORAGE_KEY = "local_deliveries";

export function useLocalDeliveries() {
  const [deliveries, setDeliveries] = useState<LocalDelivery[]>([]);

  // Cargar envíos del localStorage al montar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setDeliveries(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing stored deliveries:", e);
        setDeliveries([]);
      }
    }
  }, []);

  // Generar tracking number único
  const generateTrackingNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ENV-${timestamp}-${random}`;
  };

  // Agregar nuevo envío
  const addDelivery = async (delivery: Omit<LocalDelivery, "_id" | "trackingNumber" | "createdAt">) => {
    let trackingNumber = generateTrackingNumber();

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
      },
      declaredWorth: Number(
        delivery.declaredWorth ??
          (delivery.items || []).reduce((sum: number, item: any) => sum + (Number(item.price || 0) * Number(item.quantity || 0)), 0)
      ),
      notes: (delivery as any).notes ?? "Creado desde frontend",
    };

    // Enviar al backend usando el helper común
    try {
      const savedDelivery = await createDeliveryBackend(backendDeliveryPayload);
      if (savedDelivery) {
        // Preferir el trackingNumber/id que retorne el backend
        trackingNumber = savedDelivery.trackingNumber ?? trackingNumber;
        // si backend devuelve un _id o id, úsalo
        const backendId = savedDelivery._id ?? savedDelivery.id;

        const newDeliveryFromBackend: LocalDelivery = {
          ...delivery,
          _id: backendId ? String(backendId) : `local_${Date.now()}`,
          trackingNumber,
          createdAt: savedDelivery.createdAt ?? new Date().toISOString(),
        };

        const updated = [newDeliveryFromBackend, ...deliveries];
        setDeliveries(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        return newDeliveryFromBackend;
      }
    } catch (err) {
      console.warn("⚠️ No se pudo guardar en backend, se guardará localmente:", err);
      // Continuar y guardar localmente abajo
    }

    // Si no se pudo guardar en backend, crear el objeto local con el tracking number
    const newDelivery: LocalDelivery = {
      ...delivery,
      _id: `local_${Date.now()}`,
      trackingNumber,
      createdAt: new Date().toISOString(),
    };

    const updated = [newDelivery, ...deliveries];
    setDeliveries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newDelivery;
  };

  // Obtener envíos por usuario (simulado)
  const getByUserId = () => {
    return deliveries;
  };

  return {
    deliveries,
    addDelivery,
    getByUserId,
  };
}
