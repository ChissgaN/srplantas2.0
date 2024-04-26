import React, { useContext, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.webp";
import logoBlanco from "/logoBlanco.jpg";
import car from "/icon-cart.svg";
import trash from "/trash.svg";
import Modal from "react-modal";
import gmail from "../../public/contactos/gmail.svg";
import facebook from "../../public/contactos/facebook.svg";
import whatsapp from "../../public/contactos/whatsapp.svg";
import opinions from "../../public/contactos/opinions.svg";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button,
} from "@nextui-org/react";
import { ShoppingCartContext } from "./ShoppingCartContext";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default function NavBar({ robotExpanded, setRobotExpanded }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, addToCart, removeFromCart } =
    useContext(ShoppingCartContext);
  const [carBuy, setCarBuy] = useState(false);
  const [productQuantities, setProductQuantities] = useState({});
  const cartRef = useRef(null);

  const toggleCar = () => {
    setCarBuy(!carBuy);
  };
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
    toggleCar();
  }
  /*  console.log(openModal) */

  function closeModal() {
    setIsOpen(false);
  }

  useEffect(() => {
    const quantities = {};
    cartItems.forEach((item) => {
      quantities[item.id] = item.quantity;
    });
    setProductQuantities(quantities);
  }, [cartItems]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCarBuy(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const decreaseQuantity = (productId) => {
    const currentQuantity = productQuantities[productId] || 1;
    const newQuantity = Math.max(currentQuantity - 1, 1);
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  const totalCarrito = cartItems.reduce((total, item) => {
    return total + item.precio * (productQuantities[item.id] || 1);
  }, 0);

  const generarPDF = () => {
    const doc = new jsPDF();

    // Definir tamaño y tipo de letra para el texto
    const fontSize = 15; // Tamaño de letra
    const fontType = "times"; // Tipo de letra ("times", "helvetica", "courier")
    doc.setFontSize(fontSize); // Aplicar tamaño de letra
    doc.setFont(fontType); // Aplicar tipo de letra

    // Agregar imagen
    const imgData = logoBlanco; // Reemplaza con la ruta de tu imagen
    doc.addImage(imgData, "JPEG", 15, 10, 35, 35); // Ajusta las coordenadas y dimensiones según lo necesario

    // Agregar texto "COTIZACION"
    doc.text("COTIZACION", 130, 30); // Ajusta las coordenadas según lo necesario

    doc.text("Fecha de Emisión: " + formatDate(new Date()), 15, 60); // Agregar fecha actual

    // Calcular fecha válida hasta 10 días después
    const fechaActual = new Date();
    const fechaValidaHasta = new Date(fechaActual);
    fechaValidaHasta.setDate(fechaValidaHasta.getDate() + 10);
    doc.text("Valido hasta: " + formatDate(fechaValidaHasta), 120, 60);

    doc.text("COTIZACION DE LA COMPRA", 15, 70);

    const columns = [
      "ID",
      "Producto",
      "Precio unitario",
      "Cantidad",
      "Precio total",
    ];
    const data = cartItems.map((item, index) => {
      const cantidad = productQuantities[item.id] || 1;
      const precioTotal = item.precio * cantidad;

      return [
        index + 1,
        item.producto,
        `Q${item.precio}`,
        cantidad,
        `Q${precioTotal}`,
      ];
    });

    autoTable(doc, {
      head: [columns],
      body: data,
      startY: 80,
      theme: "grid",
    });

    doc.text(
      "¡Envío a domicilio! Tarifas dinámicas según la distancia",
      50,
      doc.lastAutoTable.finalY + 10
    );

    doc.text(
      `Total a Pagar: Q${totalCarrito}`,
      130,
      doc.lastAutoTable.finalY + 20
    );

    doc.save("Agricultura Especializada.pdf");

    // Compartir via WhatsApp
    const url = doc.output("bloburl");
    const message = `Hola Agricultura Especializada! esta es la cotización que acabo de generar en PDF y quiero finalizar mi compra!`;
    const phoneNumber = "+50233332343";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
    const file = new File(
      [doc.output("blob")],
      "Agricultura Especializada.pdf",
      { type: "application/pdf" }
    );
    const formData = new FormData();
    formData.append("file", file);
    fetch(
      "https://api.whatsapp.com/send?phone=50233332343&text=Hola%20te%20envio%20la%20orden%20de%20tu%20compra",
      {
        method: "POST",
        body: formData,
      }
    );

    // Función para formatear la fecha como "DD/MM/YYYY"
    function formatDate(date) {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    closeModal();
  };

  const [mostrarOpciones, setMostrarOpciones] = useState(false);

  const toggleOpciones = () => {
    setMostrarOpciones(!mostrarOpciones);
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);

    setRobotExpanded(!robotExpanded);
   
  };

  const handleCloseModal = () => {
    setIsMenuOpen(false);
    console.log("aqui", isMenuOpen);
  };

/*   console.log(isMenuOpen); */

  return (
    <div>
      {carBuy && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
          onClick={toggleCar}
        ></div>
      )}
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        className="fixed h-[80px]   z-40 w-full"
      >
        <NavbarContent className=" ">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden mt-5"
          />
          <NavbarBrand>
            <Link to="/">
              <img src={logo} alt="Logo" className="w-[120px] h-[55px]" />
            </Link>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-10  " justify="center">
          <NavbarItem className="hover:scale-110 hover:bg-[#67d4768e]  transition duration-300 ease-in-out hover:rounded-lg px-2 py-1 hover:font-semibold">
            <Link to="/pages/aromaticas">Productos</Link>
          </NavbarItem>

          <NavbarItem className="hover:bg-[#67d4768e]  transition duration-300 ease-in-out hover:rounded-lg px-2 py-1 hover:font-semibold">
            <div className="cursor-pointer" onClick={toggleOpciones}>
              Contactos
              {mostrarOpciones && (
                <div className="absolute top-16 left-[38%] md:left-[34%] lg:left-[38%] bg-white shadow-md px-6 py-2 rounded-md w-[200px] hover:border hover:border-[#67d4768e]">
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() =>
                      window.open("mailto:agriculturaespecializada@yahoo.es")
                    }
                  >
                    <p className="cursor-pointer">Email</p>
                    <img className="w-[25%]" src={gmail} alt="email" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/agriculturaespecializadagt"
                      )
                    }
                  >
                    <p className="cursor-pointer">Facebook</p>
                    <img className="w-[25%]" src={facebook} alt="facebook" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() => window.open("https://wa.me/50233332343")}
                  >
                    <p className="cursor-pointer">WhatsApp</p>
                    <img className="w-[25%]" src={whatsapp} alt="whatsapp" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() => window.open("/opiniones")}
                  >
                    <p className="cursor-pointer">Opiniones</p>
                    <img className="w-[25%]" src={opinions} alt="opiniones" />
                  </div>
                </div>
              )}
            </div>
          </NavbarItem>
          <NavbarItem className="hover:scale-110 hover:bg-[#67d4768e]  transition duration-300 ease-in-out hover:rounded-lg px-2 py-1 hover:font-semibold">
            <a
              color="foreground"
              href="#nosotros"
              onClick={handleContactClick}
              className="transition duration-400 ease-in-out"
            >
              Acerca de nosotros
            </a>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end" className="max-sm:mt-3 ">
          <NavbarItem>
            <Button
              variant="flat"
              onClick={toggleCar}
              className="relative flex items-center bg-[#67d4768e] pt-1"
            >
              <div className="flex items-center ">
                <img src={car} alt="LogoC" className="w-[25px] h-[23px] " />
                <span className=" absolute right-2 top-0 rounded-xl px-[8px] text-gray-600 ml-1 bg-gray-100 text-[12px]">
                  {cartItems.length}
                </span>
              </div>
            </Button>
          </NavbarItem>
          {carBuy && (
            <div
              ref={cartRef}
              className="rounded-md bg-white shadow-md absolute right-9 top-[85px] z-50 p-4 w-[90%] mx-auto"
            >
              <div className="flex items-center justify-between ">
                <h4 className="px-6 py-2 text-lg font-bold">
                  Carrito de Compras.
                </h4>
                <p className="pr-14">
                  Total: Q <strong>{totalCarrito}</strong>
                </p>
              </div>
              <hr />
              <div className="grid max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-6 px-4 py-4 overflow-y-auto max-h-[400px] resultados-container">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-green-200  mx-auto rounded-2xl w-[200px] h-[290px] sm:w-[190px]  max-sm:w-[195px] p-3"
                  >
                    <h6 className="text-yellow-500 font-semibold w-full truncate text-center mb-2">
                      {item.producto}
                    </h6>
                    <img
                      src={item.imagen}
                      alt={item.producto}
                      className="size-28 mx-auto rounded-xl"
                    />
                    <div className="text-center">
                      <span className="font-bold text-center">Cantidad</span>
                      <div className="flex flex-row items-center justify-center">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="px-2 py-1 rounded-md bg-gray-200"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={
                            productQuantities[item.id]
                              ? productQuantities[item.id]
                              : ""
                          }
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setProductQuantities((prevQuantities) => ({
                              ...prevQuantities,
                              [item.id]: value,
                            }));
                          }}
                          className="w-10 text-center"
                        />
                        <button
                          onClick={() => {
                            setProductQuantities((prevQuantities) => ({
                              ...prevQuantities,
                              [item.id]: (prevQuantities[item.id] || 1) + 1,
                            }));
                          }}
                          className="px-2 py-1 rounded-md bg-gray-200"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-bold">
                        Precio: Q
                        <span className="font-bold">
                          {item.precio * (productQuantities[item.id] || 1)}
                        </span>
                      </span>
                    </div>
                    <div className="w-full flex justify-center mt-2 ">
                      <button
                        className="bg-red-500 w-8 hover:bg-red-600 rounded p-1 transition duration-100 ease-in-out  hover:scale-[1.1]"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <img src={trash} alt="icon de basurero" className="" />
                      </button>
                    </div>
                  </div>
                ))}

                <div></div>
              </div>
              <div className="flex justify-end ">
                <button
                  className={`bg-blue-400 hover:bg-blue-600 text-white py-2 px-6 rounded-[10px] mt-4 hover:scale-[1.05]  transition duration-300 ease-in-out ${
                    cartItems.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  //onClick={generarPDF
                  onClick={openModal}
                  disabled={cartItems.length === 0}
                >
                  CREAR PDF
                </button>
              </div>
            </div>
          )}
        </NavbarContent>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Descarga de Orden de compra PDF"
        >
          <form>
            <input />
            <h2>Gracias!</h2>
            <div>
              Estamos listos para procesar su orden de compra y generarla en
              formato PDF.
            </div>
            <div>
              Para generar el archivo y compartirlo con nosotros, por favor haga
              click "Enviar Via WhatsApp"
            </div>
            <div>y adjunte al mensaje el archivo que acaba de descargar.</div>
            <div>
              <button
                className={`bg-blue-400 hover:bg-blue-600 text-white py-2 px-6 rounded-[10px] mt-4 hover:scale-[1.05]  transition duration-300 ease-in-out ${
                  cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                //onClick={generarPDF
                onClick={generarPDF}
                disabled={cartItems.length === 0}
              >
                Enviar Via WhatsApp
              </button>
            </div>
          </form>
        </Modal>
        <NavbarMenu className="">
          <NavbarMenuItem className="pt-5 flex flex-col">
            <Link
              to="/pages/aromaticas"
              className="w-full py-3 hover:scale-105  hover:bg-[#67d4768e] hover:rounded-[10px] transition duration-300 ease-in-out px-2 hover:font-semibold "
              href="#"
              size="lg"
            >
              Productos
            </Link>
            <div
              className="w-full py-3 hover:scale-105 hover:bg-[#67d4768e] transition duration-300 ease-in-out px-2 hover:rounded-[10px] hover:font-semibold"
              onClick={toggleOpciones}
            >
              Contactos
              {mostrarOpciones && (
                <div className="absolute top-full pt-3 bg-white shadow-md px-6 rounded-md w-[200px]">
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() => window.open("mailto:chissgan.13@gmail.com")}
                  >
                    <p className="cursor-pointer">Gmail</p>
                    <img className="w-[25%]" src={gmail} alt="email" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/agriculturaespecializadagt"
                      )
                    }
                  >
                    <p className="cursor-pointer">Facebook</p>
                    <img className="w-[25%]" src={facebook} alt="facebook" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() => window.open("https://wa.me/50233332343")}
                  >
                    <p className="cursor-pointer">WhatsApp</p>
                    <img className="w-[25%]" src={whatsapp} alt="whatsapp" />
                  </div>
                  <div
                    className="flex justify-between items-center mb-3 hover:bg-[#67d4768e] rounded-lg cursor:pointer p-2"
                    onClick={() => window.open("/opiniones")}
                  >
                    <p className="cursor-pointer">Opiniones</p>
                    <img className="w-[25%]" src={opinions} alt="opiniones" />
                  </div>
                </div>
              )}
            </div>

            <Link
              to="#about"
              className="w-full py-3 hover:scale-105 hover:bg-[#67d4768e]  transition duration-300 ease-in-out px-2 hover:rounded-[10px] hover:font-semibold"
              onClick={handleContactClick}
            >
              <a
                href="#nosotros"
                className="w-full py-3 hover:scale-105 hover:bg-[#67d4768e]  transition duration-300 ease-in-out px-2 hover:rounded-[10px] hover:font-semibold cursor-pointer"
                size="lg"
              >
                Acerca de nosotros
              </a>
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </div>
  );
}
