import { useState } from "react";

export interface CartProduct {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface Cart {
  cartId: string;
  sellerId: string;
  items: CartProduct[];
  package?: {
    weight: number;
    length: number;
    width: number;
    height: number;
  };
  total: number;
}

const DEFAULT_CART: Cart = {
  cartId: "cart_001",
  sellerId: "seller_001",
  items: [
    {
      productId: "prod_001",
      name: "iPhone 14 Pro",
      quantity: 1,
      price: 899990,
      weight: 0.5,
      length: 20,
      width: 15,
      height: 10,
    },
    {
      productId: "prod_002",
      name: "Samsung Galaxy S23",
      quantity: 1,
      price: 799990,
      weight: 0.6,
      length: 22,
      width: 16,
      height: 12,
    },
    {
      productId: "prod_003",
      name: "AirPods Pro",
      quantity: 2,
      price: 299990,
      weight: 0.1,
      length: 10,
      width: 8,
      height: 6,
    },
  ],
  total: 2199960,
};

export function useCart() {
  const [cart, setCart] = useState<Cart>(DEFAULT_CART);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(
    null,
  );

  const calculateTotalWeight = () => {
    return cart.items.reduce((sum, item) => sum + (item.weight || 0.5) * item.quantity, 0);
  };

  const calculatePackageDimensions = (product: CartProduct) => {
    return {
      weight: (product.weight || 0.5) * product.quantity,
      length: product.length || 30,
      width: product.width || 20,
      height: product.height || 15,
    };
  };

  const calculateTotalCartDimensions = () => {
    let totalWeight = 0;
    let maxLength = 0;
    let maxWidth = 0;
    let maxHeight = 0;

    cart.items.forEach((item) => {
      const itemWeight = (item.weight || 0.5) * item.quantity;
      const itemLength = item.length || 30;
      const itemWidth = item.width || 20;
      const itemHeight = item.height || 15;

      totalWeight += itemWeight;
      maxLength = Math.max(maxLength, itemLength);
      maxWidth = Math.max(maxWidth, itemWidth);
      maxHeight = Math.max(maxHeight, itemHeight);
    });

    return {
      weight: totalWeight,
      length: maxLength,
      width: maxWidth,
      height: maxHeight,
    };
  };

  const calculateTotalDeclaredWorth = () => {
    return cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return {
    cart,
    setCart,
    selectedProduct,
    setSelectedProduct,
    calculateTotalWeight,
    calculatePackageDimensions,
    calculateTotalCartDimensions,
    calculateTotalDeclaredWorth,
  };
}
