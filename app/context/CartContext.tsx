"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  stripePriceId?: string;
};

type CartContextType = {
  items: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    size?: string
  ) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_STORAGE_KEY = "melted-mindz-cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  /*
   * LOAD CART FROM LOCAL STORAGE
   */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error("Unable to load cart:", error);

      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setLoaded(true);
    }
  }, []);

  /*
   * SAVE CART TO LOCAL STORAGE
   */

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_STORAGE_KEY);
      } else {
        localStorage.setItem(
          CART_STORAGE_KEY,
          JSON.stringify(items)
        );
      }
    } catch (error) {
      console.error("Unable to save cart:", error);
    }
  }, [items, loaded]);

  /*
   * ADD ITEM
   */

  function addToCart(item: CartItem) {
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size
      );

      if (existingItem) {
        return currentItems.map((cartItem) => {
          if (
            cartItem.id === item.id &&
            cartItem.size === item.size
          ) {
            return {
              ...cartItem,
              quantity:
                cartItem.quantity + item.quantity,
            };
          }

          return cartItem;
        });
      }

      return [
        ...currentItems,
        {
          ...item,
          quantity: Math.max(1, item.quantity),
        },
      ];
    });
  }

  /*
   * REMOVE ITEM
   */

  function removeFromCart(
    id: string,
    size?: string
  ) {
    setItems((currentItems) => {
      return currentItems.filter((item) => {
        return !(
          item.id === id &&
          item.size === size
        );
      });
    });
  }

  /*
   * UPDATE QUANTITY
   */

  function updateQuantity(
    id: string,
    quantity: number,
    size?: string
  ) {
    if (quantity <= 0) {
      removeFromCart(id, size);
      return;
    }

    setItems((currentItems) => {
      return currentItems.map((item) => {
        if (
          item.id === id &&
          item.size === size
        ) {
          return {
            ...item,
            quantity: Math.min(20, quantity),
          };
        }

        return item;
      });
    });
  }

  /*
   * CLEAR ENTIRE CART
   */

  function clearCart() {
    setItems([]);
  }

  /*
   * CART COUNT
   */

  const cartCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  /*
   * CART TOTAL
   */

  const cartTotal = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside a CartProvider."
    );
  }

  return context;
}