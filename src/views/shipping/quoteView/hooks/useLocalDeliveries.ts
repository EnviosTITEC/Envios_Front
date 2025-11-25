// Hook para manejar envíos almacenados localmente (simulado)
import { useEffect, useState } from "react";

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

    // Guardar en el backend
    try {
      const backendDelivery = {
        userId: "user_456", // TODO: Obtener del contexto del usuario
        sellerId: delivery.shippingInfo?.originAddressId || "seller_789",
        cartId: `cart-${Date.now()}`,
        items: delivery.items || [],
        package: delivery.package || {
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
        },
        shippingInfo: {
          originAddressId: delivery.shippingInfo?.originAddressId || "addr_origin_123",
          destinationAddressId: delivery.shippingInfo?.destinationAddressId || "addr_dest_456",
          carrierName: "Chilexpress",
          serviceType: delivery.shippingInfo?.serviceType || "EXPRESS",
          estimatedCost: delivery.shippingInfo?.estimatedCost || 0,
        },
        declaredWorth: delivery.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0,
        notes: "Creado desde frontend",
      };

      const response = await fetch("http://localhost:3100/api/deliveries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(backendDelivery),
      });

      if (response.ok) {
        const savedDelivery = await response.json();
        // Usar el tracking number que retornó el backend
        trackingNumber = savedDelivery.trackingNumber;
        console.log("✅ Envío guardado en backend:", trackingNumber);
      } else {
        const errorData = await response.text();
        console.warn("⚠️ No se pudo guardar en backend (Status:", response.status + ")");
        console.warn("Response:", errorData);
      }
    } catch (error) {
      console.warn("⚠️ Error guardando en backend:", error);
    }

    // Crear el objeto local con el tracking number (del backend si está disponible)
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
