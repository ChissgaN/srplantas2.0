import React, { createContext, useState } from "react";

const ShoppingCartContext = createContext();

const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductCart, setSelectedProductCart] = useState({
    quantity: 1,
  });

  const [productoNombre, setProductoNombre] = useState("");
  console.log("Valor inicial de productoNombre:", productoNombre);

  const addToCart = (product) => {
    setCartItems((prevCartItems) => [...prevCartItems, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item.id !== productId);
    setCartItems(updatedCartItems);
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        selectedProduct,
        setSelectedProduct,
        selectedProductCart,
        setSelectedProductCart,
        productoNombre,
        setProductoNombre,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export { ShoppingCartContext, ShoppingCartProvider };
