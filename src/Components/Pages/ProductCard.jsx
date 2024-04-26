import React, { useContext, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { ShoppingCartContext} from "../ShoppingCartContext";

const ProductCard = ({ product, openModal }) => {
  const { addToCart, cartItems, setCartItems, setSelectedProductCart } =
    useContext(ShoppingCartContext);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchProduct = searchParams.get("search");
    if (searchProduct) {
      setSelectedProductCart(JSON.parse(decodeURIComponent(searchProduct)));
    }
  }, [location]);

  const handleClick = () => {
    openModal(product);
  };

  const handleAddToCart = (product) => {
    console.log("aqui estoy:", selectedProduct);
    const existingProductIndex = cartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex !== -1) {
      const updatedCartItems = cartItems.map((item, index) => {
        if (index === existingProductIndex) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      addToCart({ ...product, quantity: 1 });
    }
  };
  const {selectedProduct} = useContext(ShoppingCartContext)
  return (
    <div
      className="bg-white rounded-xl px-2 hover:scale-105 duration-500 ease-in-out mb-3 max-w-[240px] max-h-[434px] cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={product.imagen}
        alt={product.producto}
        className="w-full h-fit object-cover rounded-xl max-w-[230px] max-h-[306px]"
      />

      <h3 className="text-lg font-semibold mt-2 max-h-[28px] overflow-auto">
        {product.producto}
      </h3>

      <p className="text-gray-600">Q {product.precio}</p>

      <Button
        color="warning"
        variant="ghost"
        className="flex content-center mx-auto transition-colors hover:scale-105 duration-500 ease-in-out mb-3 hover:text-white"
        onClick={() => handleAddToCart(product)}
      >
        Agregar al carrito
      </Button>
    </div>
  );
};

export default ProductCard;
