import React, { useState, useEffect, useContext } from "react";
import NavBar from "../NavBar";
import todo from "/procesoSiembra/semillas.webp";
import ProductCard from "./ProductCard";
import categorias from "../../scripts/products";
import { Link } from "react-router-dom";
import categoria from "../../../public/categorias.json";
import { Button } from "@nextui-org/react";
import ScrollToTopButton from "../ScrollToTop";
import { ShoppingCartContext } from "../ShoppingCartContext";
import { useParams, useLocation } from "react-router-dom";

const PagesCards = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productName = searchParams.get("product");

  const params = useParams();
  const categoriaURL = params.id;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(categoriaURL) || "";
  const [selectedSortOption, setSelectedSortOption] = useState("default");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [loadedCards, setLoadedCards] = useState(60);
  const [loading, setLoading] = useState(false);
  const {
    addToCart,
    cartItems,
    setCartItems,
    selectedProductCart,
    setSelectedProductCart,
    productoNombre,
    setProductoNombre
  } = useContext(ShoppingCartContext);

  useEffect(() => {
   
    const storedProductNombre = localStorage.getItem("productoNombre");
    if (storedProductNombre) {
      setProductoNombre(storedProductNombre);
      setSearchTerm(storedProductNombre); 
    }
  }, []);

  console.log("Valor de productoNombre en PagesCards:", productoNombre);
  /* console.log(setProductoNombre); */

  const handleAddToCart = () => {
    console.log("aqui estoy:", selectedProductCart);
    const existingProductIndex = cartItems.findIndex(
      (item) => item.id === selectedProductCart.id
    );

    if (existingProductIndex !== -1) {
      const updatedCartItems = cartItems.map((item, index) => {
        if (index === existingProductIndex) {
          return {
            ...item,
            quantity: item.quantity + selectedProductCart.quantity,
          };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } else {
      addToCart(selectedProductCart);
    }
    closeModal();
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSelectedSortOption(event.target.value);
  };

  const handleCategoryClick = (categoria) => {
    if (categoria === "Mostrar Todo") {
      setShowAllProducts(true);
      setSelectedCategory("Mostrar Todo");
    } else {
      setSelectedCategory(categoria);
      setShowAllProducts(false);
    }
    setLoadedCards(60);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }
      setLoading(true);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  useEffect(() => {
    if (!loading) return;

    setTimeout(() => {
      setLoadedCards((prev) => prev + 6);
      setLoading(false);
    }, 500);
  }, [loading]);

  let sortedProducts = [];

  switch (selectedSortOption) {
    case "priceAsc":
      sortedProducts = categorias[0][selectedCategory]
        .slice()
        .sort((a, b) => a.precio - b.precio);
      break;
    case "priceDesc":
      sortedProducts = categorias[0][selectedCategory]
        .slice()
        .sort((a, b) => b.precio - a.precio);
      break;
    case "nameAsc":
      sortedProducts = categorias[0][selectedCategory]
        .slice()
        .sort((a, b) => a.producto.localeCompare(b.producto));
      break;
    case "nameDesc":
      sortedProducts = categorias[0][selectedCategory]
        .slice()
        .sort((a, b) => b.producto.localeCompare(a.producto));
      break;
    default:
      sortedProducts = categorias[0][selectedCategory];
      break;
  }

  // Filtrar los productos por nombre si hay un nombre de producto en la URL
  if (productName) {
    sortedProducts = sortedProducts.filter(
      (product) => product.producto === productName
    );
  }

  const openModal = (product) => {
    setSelectedProduct(product);
    setSelectedProductCart({ ...product, quantity: 1 });
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  const handleModalClick = (event) => {
    if (event.target.classList.contains("modal-background")) {
      closeModal();

      const existingProductIndex = cartItems.findIndex(
        (item) => item.id === selectedProductCart.id
      );
      if (existingProductIndex !== -1) {
        const updatedCartItems = cartItems.map((item, index) => {
          if (index === existingProductIndex) {
            return { ...item, quantity: selectedProductCart.quantity };
          }
          return item;
        });
        setCartItems(updatedCartItems);
      }
    }
  };

  const categoryImages = {
    aromaticas: "/categoria/aromaticas.webp",
    bulbos: "/categoria/bulbos.webp",
    cesped: "/categoria/cesped.webp",
    contenedores: "/categoria/contenedores.webp",
    hortalizas: "/categoria/hortalizas.webp",
    ornamentales: "/categoria/hornamentales.webp",
    sustratos: "/categoria/sustrato.webp",
    "Mostrar Todo": "/procesoSiembra/semillas.webp",
  };
  const imageSrc = categoryImages[selectedCategory];
  const handleClearSearch = () => {
    setSearchTerm("");
    localStorage.removeItem("productoNombre");
  };
  return (
    <>
      <NavBar />
      <section className="mt-28 w-[90%] mx-auto relative flex justify-center items-center">
        <img
          className="bg-slate-700 rounded-2xl md:h-[420px] md:w-full"
          src={imageSrc}
          alt={""}
        />
        <div className="absolute text-white font-extrabold text-[60px] max-lg:text-[50px] max-md:text-[40px] max-sm:text-[30px] ">
          {selectedCategory ? selectedCategory.toUpperCase() : ""}
        </div>
      </section>
      <section className="container mx-auto p-4 w-[90%] flex justify-between ">
        <div className="flex max-sm:flex max-sm:flex-col items-center w-full  md:gap-[3%] gap-[10%] ">
          <h1 className="text-3xl font-semibold my-10 max-md:hidden">
            {selectedCategory ? selectedCategory.toUpperCase() : ""}
          </h1>
          <div className=" max-sm:w-full w-full md:flex md:justify-end  ">
          <input
  type="text"
  placeholder={`Buscar ${selectedCategory}...`}
  value={searchTerm}
  onChange={handleSearchChange}
  className="h-fit px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-400 w-full"
/>
    {searchTerm && (
      <button
        onClick={handleClearSearch}
        className="ml-2 bg-gray-300 text-gray-600 px-2 py-1 rounded-md focus:outline-none hover:bg-gray-400"
      >
        Limpiar
      </button>
    )}
          </div>
          <div className="md:flex md:items-end w-full   md:justify-end ">
            <select
              className="h-auto px-2 py-2 border border-gray-300 rounded-md focus:outline-none  w-full"
              value={selectedSortOption}
              onChange={handleSortChange}
            >
              <option value="default" disabled>
                Ordenar por...
              </option>
              <option value="priceAsc">Precio: Menor a mayor</option>
              <option value="priceDesc">Precio: Mayor a menor</option>
              <option value="nameAsc">Nombre: Ascendente</option>
              <option value="nameDesc">Nombre: Descendente</option>
              <option value="all">Mostrar todos</option>
            </select>
          </div>
        </div>
      </section>

      <section className="container mx-auto pr-4 w-[85%] flex max-md:w-full  max-sm:gap-0 gap-20  ">
        <div className="container w-[40%] max-md:w-[37%] md:w-[34%] lg:w-[20%] max-sm:w-[140px] h-screen py-4 sticky top-[130px] max-sm:mr-[10%] max-sm:ml-3">
          <h2 className="text-xl font-semibold mb-4 max-sm:text-sm max-sm:font-bold">
            Categorías
          </h2>
          <ul className="space-y-2 cursor-pointer ">
            {Object.keys(categorias[0]).map((nombreCategoria, index) => (
              <li
                key={index}
                id={`categoria-${index}`}
                className="flex items-center hover:bg-gray-200 hover:scale-105 rounded-md py-2 transition duration-300 ease-in-out pl-1 focus:bg-gray-200"
                onClick={() => handleCategoryClick(nombreCategoria)}
              >
                <img
                  src={categoryImages[nombreCategoria]}
                  alt={categoria[index].tituloCategoria}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="max-sm:text-[11px]">
                  {categoria[index].tituloCategoria}
                </span>
              </li>
            ))}
            <li
              id="mostrar-todo"
              className="flex items-center hover:bg-gray-200 hover:scale-105 rounded-md py-2 transition duration-300 ease-in-out pl-1"
              onClick={() => handleCategoryClick("Mostrar Todo")}
            >
              <img
                src={todo}
                alt="todo"
                className="size-8 bg-slate-600 rounded-full mr-2"
              />
              <span className="max-sm:text-sm">Mostrar Todo</span>
            </li>
          </ul>
        </div>
        {!showAllProducts && (
          <div className="w-fit py-4 mx-auto ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 w-fit">
              {sortedProducts &&
                sortedProducts.length > 0 &&
                sortedProducts
                  .filter(
                    (product, index) =>
                      index < loadedCards &&
                      (searchTerm === "" ||
                        product.producto
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()))
                  )
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      openModal={openModal}
                      setSelectedProductCart={setSelectedProductCart}
                    />
                  ))}
            </div>
            <div className="flex justify-center my-4 mx-auto max-sm:w-[120px]">
            {productName && (
              <div className="cursor-pointer border border-green-600 rounded-lg max-sm:p-2 p-3 text-green-600 hover:bg-green-500 transition-colors duration-1000 hover:text-white hover:shadow-md">
                <Link to="/pages/aromaticas">Mostrar todos los productos</Link>
              </div>
            )}
            </div>
            {loading && (
              <div className="flex justify-center">
                <Button
                  isLoading
                  className="bg-green-600 text-white"
                  color=""
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  Loading
                </Button>
              </div>
            )}
          </div>
        )}
        {showAllProducts && (
          <div className="w-fit py-4 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 w-fit  ">
              {Object.keys(categorias[0]).flatMap((category) =>
                categorias[0][category]
                  .filter((product, index) => index < loadedCards)
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      openModal={openModal}
                      setSelectedProductCart={setSelectedProductCart}
                    />
                  ))
              )}
            </div>
            {loading && (
              <div className="flex justify-center">
                <Button
                  isLoading
                  className="bg-green-600 text-white"
                  color=""
                  spinner={
                    <svg
                      className="animate-spin h-5 w-5 text-current"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                  }
                >
                  Loading
                </Button>
              </div>
            )}
          </div>
        )}
      </section>
      {selectedProduct && (
        <div
          className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-80 bg-black modal-background`}
          onClick={handleModalClick}
        >
          <div className="bg-white py-8 px-6 rounded-lg w-[50%] h-[70%] flex gap-6 max-sm:w-[95%] max-sm:px-3 sm:w-[80%] sm:h-[70%] shadow-xl   ">
            <div className="h-[100%] w-[50%] max-sm:w-[224px]  max-sm:h-[304px] sm:w-[60%]  sm:h-[80%] md:w-[276px] max-md:h-[390px] max-md:w-[276px] md:h-[390px] ">
              <img
                src={selectedProduct.imagen}
                alt={selectedProduct.nombre}
                className="w-full h-full  object-cover rounded-md mb-4  max-sm:w-[224px]  max-sm:h-[304px] max-md:h-[390px] max-md:w-[276px]"
              />
              <div className="flex">
                <button
                  className="w-[80%] hover:bg-green-500 transition-colors duration-1000 text-white px-4 py-2 rounded-md  bg-green-600 mx-auto sm:hidden"
                  onClick={() => handleAddToCart(selectedProduct)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
            <div className="h-[100%] w-[50%] flex flex-col max-sm:w-[40%] max-sm:h-full lg:w-[60%]">
              <div className="py-4 flex flex-col justify-between h-full w-full  ">
                <h2 className="text-xl font-semibold mb-2 ">
                  {selectedProduct.producto}
                </h2>
                <p className="text-gray-600 ">
                  Precio: Q {selectedProduct.precio}
                </p>
                <p className="text-gray-600  w-full h-full overflow-hidden text-pretty mb-4">
                  Descripción: {selectedProduct.descripcion}
                </p>

                <div className="flex justify-center items-center content-center mb-6">
                  <button
                    className="px-3 py-1 rounded-md bg-gray-200 "
                    onClick={() =>
                      setSelectedProductCart({
                        ...selectedProductCart,
                        quantity: Math.max(selectedProductCart.quantity - 1, 1),
                      })
                    }
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={selectedProductCart.quantity}
                    onChange={(event) =>
                      setSelectedProductCart({
                        ...selectedProductCart,
                        quantity: parseInt(event.target.value),
                      })
                    }
                    className="w-1/4 text-center h-full border border-gray-300 rounded-md focus:outline-none focus:border-blue-400"
                  />
                  <button
                    className="px-3 py-1 rounded-md bg-gray-200"
                    onClick={() =>
                      setSelectedProductCart({
                        ...selectedProductCart,
                        quantity: selectedProductCart.quantity + 1,
                      })
                    }
                  >
                    +
                  </button>
                </div>

                <div className="flex">
                  <button
                    className="hover:bg-green-500 transition-colors duration-1000 text-white px-4 py-2 rounded-md bg-green-600 mx-auto max-sm:hidden"
                    onClick={() => handleAddToCart(selectedProduct)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ScrollToTopButton />
    </>
  );
};

export default PagesCards;
