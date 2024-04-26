import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, openModal }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} openModal={openModal} />
      ))}
    </div>
  );
};

export default ProductGrid;
