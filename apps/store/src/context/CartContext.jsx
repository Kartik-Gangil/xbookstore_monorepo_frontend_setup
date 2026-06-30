import React, { createContext, useState, useContext } from "react";
import api from "../api/axiosConfig";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Helper function to convert backend response
  const formatCartItems = (items) => {
    return items.map((item) => ({
      id: item.book.id, // BookFormat ID
      cartId: item.id, // CartItem ID
      quantity: item.quantity,
      price: item.book.mrp,
      title: item.book.title,
      imageUrl: item.book.cover_image,
      format_name: item.book.format_name,

      isbn: item.book.isbn || "",
      publicationDate: item.book.publication_date || "",
      publicationName: item.book.publication_name || "Xoffencer",
      participants: item.book.participants || [],
    }));
  };

  // ================= FETCH CART =================

  const fetchCartItem = async () => {
    try {
      const res = await api.get("api/cart");
      setCartItems(formatCartItems(res.data.items));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD ITEM =================

  const addItemToCart = async (item) => {
    try {
      const existingItem = cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      let response;

      if (existingItem) {
        response = await api.post("api/cart/increase-quantity/", {
          cart_item_id: existingItem.cartId,
        });
      } else {
        response = await api.post("api/cart/add-item/", {
          book_format_id: item.id,
          quantity: 1,
        });
      }

      setCartItems(formatCartItems(response.data.items));
    } catch (error) {
      console.error(error);
    }
  };

  // ================= REMOVE ITEM =================

  const removeItemFromCart = async (cartItemId) => {
    try {
      const res = await api.post("api/cart/remove-item/", {
        cart_item_id: cartItemId,
      });

      setCartItems(formatCartItems(res.data.items));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= INCREASE =================

  const increaseQuantity = async (cartItemId) => {
    try {
      const res = await api.post("api/cart/increase-quantity/", {
        cart_item_id: cartItemId,
      });

      setCartItems(formatCartItems(res.data.items));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DECREASE =================

  const decreaseQuantity = async (cartItemId) => {
    try {
      const res = await api.post("/api/cart/decrease-quantity/", {
        cart_item_id: cartItemId,
      });

      setCartItems(formatCartItems(res.data.items));
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UPDATE =================

  const updateItemQuantity = async (cartItemId, quantity) => {
    const item = cartItems.find((i) => i.cartId === cartItemId);

    if (!item) return;

    const diff = quantity - item.quantity;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        await increaseQuantity(cartItemId);
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        await decreaseQuantity(cartItemId);
      }
    }
  };

  // ================= CLEAR =================

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        fetchCartItem,
        addItemToCart,
        removeItemFromCart,
        increaseQuantity,
        decreaseQuantity,
        updateItemQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider >
  );
}