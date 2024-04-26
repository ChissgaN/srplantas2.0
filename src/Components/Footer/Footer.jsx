import React, { useState } from "react";
import logo from "/logo.webp";

export default function Footer() {
  return (
    <>
      <div className="py-6 px-16 bg-gray-200 w-full ">
        <div className="flex justify-between items-center w-full">
          <p className=" sm:text-[17] max-sm:text-[14px] ">
            ©2024 Distribuidora Agricultura Especializada
          </p>
          <img src={logo} alt="" className="w-28 " />
        </div>
      </div>
    </>
  );
}
