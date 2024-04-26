import React, { useState, useContext, useEffect } from "react";
import { Button } from "@nextui-org/react";
import searchIcon from "/search.svg";
import categorias from "../scripts/products";
import { Link } from "react-router-dom";
import "../App.css";
import { ShoppingCartContext } from "./ShoppingCartContext";

export default function Beginning() {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
 const {productoNombre, setProductoNombre} = useContext(ShoppingCartContext);


  const handleInputChange = (e) => {
    console.log(inputValue)

    const value = e.target.value;
    setInputValue(value);

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    const filteredResults = categorias.flatMap((categoria) =>
      Object.values(categoria).flatMap((productos) =>
        productos.filter(
          (producto) =>
            producto.producto &&
            producto.producto.toLowerCase().startsWith(value.toLowerCase())
        )
      )
    );

    setSearchResults(filteredResults);
  };

  // const handleResultClick = (producto) => {
  //   setInputValue(producto.producto);
  //   const category = getCategoryOfProduct(producto);
  //   setSelectedCategory(category);
  //   /* console.log("Selected Product Category:", category); */
  //   setSearchResults([producto]);
  //  /*  console.log("Selected Product Product:", producto.producto); */
  // const nombreCat =  producto.producto;
  // setProductoNombre(nombreCat)

  //  console.log("valueFinal", searchResults[0].producto);
  //  console.log("categoria",category);
   
  // };

  // useEffect(() => {
  //   console.log("productoNombre actualizado:", productoNombre);
  // }, [productoNombre]);

  const handleResultClick = (producto) => {
    setInputValue(producto.producto);
    const category = getCategoryOfProduct(producto);
    setSelectedCategory(category);
    setSearchResults([producto]);

    const nombreCat = producto.producto;
    setProductoNombre(nombreCat);

    
    localStorage.setItem("productoNombre", nombreCat);
  };

 
  

  const getCategoryOfProduct = (product) => {
    const productName = product.producto.toLowerCase();

    for (const categoria of categorias) {
      for (const key in categoria) {
        const foundProduct = categoria[key].find(
          (item) => item.producto.toLowerCase() === productName
        );
        if (foundProduct) {
          return key;
        }
      }
    }
    return "";
  };

  return (
    <section className="beginning-container w-full max-sm:w-screen max-md:w-full md:mt-12">
      <div className="my-8 w-full relative px-10 p-5 max-sm:w-screen max-sm:px-5 max-md:w-[80%] ">
        <h1 className="font-medium text-3xl md:text-[34px] lg:text-[40px] mb-3 text-white">¡Comienza a sembrar hoy!</h1>
        <div className="flex gap-5 ">
          <div className="flex items-center w-[55%] sm:w-[79%] max-sm:w-[100%] bg-white px-3 rounded-[10px] transition-[5s] hover:scale-105  duration-200 ease-in-out max-w-[640px]">
            <img src={searchIcon} alt="Search" className="mr-2 p-2 " />
            <input
              className="w-[100%] h-full bg-transparent focus:outline-none flex items-center justify-center content-center pt-0 mt-0 pb-1"
              type="text"
              placeholder="¿Qué quieres sembrar?"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
          <Link
            to={`/pages/${selectedCategory.toLowerCase()}`}
           
          >
            <Button
              color="success"
              className="bg-green-100 h-full hover:bg-green-200 transition-[5s] hover:scale-110 duration-300 ease-in-out rounded-[10px] py-[13px] px-6 text-gray-500"
              onClick={""}
            >
              Buscar
            </Button>
          </Link>
        </div>

        {inputValue && (
          <div className="resultados-container md:max-h-[200px] max-md:h-[210px] lg:max-h-[225px] max-sm:w-[100%] md:w-[95%] lg:w-[72%] xl:w-[59%] max-sm:max-h-[205px] mt-3 overflow-y-auto overflow-x-auto flex flex-wrap justify-around bg-white p-3 px-8 gap-8 rounded-lg max-w-[640px] shadow-lg transition duration-300 hover:shadow-xl z-40">
            {searchResults.map((producto) => (
              <div
                key={producto.id}
                onClick={() => handleResultClick(producto)}
                className="resultado-item flex-shrink-0 cursor-pointer rounded-lg hover:border hover:border-[#67d4768e] hover:shadow-xl hover:shadow-[#67d4768e] hover:shadow-right hover:shadow-bottom shadow-none z-50"
              >
                <img
                  className="w-28 h-28 border rounded-lg"
                  src={producto.imagen}
                  alt={producto.producto}
                />
                <p className="m-0 w-28 text-pretty text-center">
                  {producto.producto}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
