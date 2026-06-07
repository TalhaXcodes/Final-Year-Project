import React, { createContext, useContext, useEffect, useState } from "react";
const DISCOUNT_KEY = "basketries_discount";

const CartContext = createContext();


const CART_KEY = "basketries_cart";
const FAVORITES_KEY = "basketries_favorites";

const getStoredData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => getStoredData(CART_KEY));
  const [favorites, setFavorites] = useState(() =>
    getStoredData(FAVORITES_KEY)
  );
  const [discount, setDiscount] = useState(() => {
    try {
      const data = localStorage.getItem(DISCOUNT_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(DISCOUNT_KEY, JSON.stringify(discount));
  }, [discount]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const stock = Number(item.stock || 0);

        if (stock > 0 && item.quantity >= stock) {
          return item;
        }

        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );

  const applyDiscountCode = (code) => {
    const normalizedCode = code.trim().toUpperCase();
    const subtotal = getCartTotal();

    const discountCodes = {
      BASKET10: {
        code: "BASKET10",
        type: "percentage",
        value: 10,
        minOrder: 0,
        label: "10% discount applied",
      },
      GIFT500: {
        code: "GIFT500",
        type: "flat",
        value: 500,
        minOrder: 3000,
        label: "Rs 500 discount applied",
      },
      WELCOME15: {
        code: "WELCOME15",
        type: "percentage",
        value: 15,
        minOrder: 5000,
        label: "15% welcome discount applied",
      },
    };

    const selectedDiscount = discountCodes[normalizedCode];

    if (!selectedDiscount) {
      return {
        success: false,
        message: "Invalid discount code.",
      };
    }

    if (subtotal < selectedDiscount.minOrder) {
      return {
        success: false,
        message: `Minimum order of Rs ${selectedDiscount.minOrder.toLocaleString()} required.`,
      };
    }

    setDiscount(selectedDiscount);

    return {
      success: true,
      message: selectedDiscount.label,
    };
  };

  const removeDiscount = () => {
    setDiscount(null);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartTotal();

    if (!discount) return 0;

    if (discount.type === "percentage") {
      return Math.round((subtotal * discount.value) / 100);
    }

    return Math.min(discount.value, subtotal);
  };

  const getFinalCartTotal = () => {
    return Math.max(getCartTotal() - getDiscountAmount(), 0);
  };

  const addToFavorites = (product) => {
    setFavorites((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;

      return [...prev, product];
    });
  };

  const removeFromFavorites = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        favorites,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getCartCount,
        getCartTotal,
        addToFavorites,
        removeFromFavorites,
        discount,
        applyDiscountCode,
        removeDiscount,
        getDiscountAmount,
        getFinalCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);