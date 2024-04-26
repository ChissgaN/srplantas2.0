import React from "react";

export const Index = ({ procesoImg, tituloProceso, descripcionProceso }) => {
  return (
    <>
      <div className="container h-full py-3  mx-aut transition duration-100 ease-in-out  hover:scale-[1.05]">
        <img
          src={procesoImg}
          alt="proceso"
          className="rounded-[10px] w-full h-[270px]"
          loading="lazy"
        />
        <h2 className="text-[23px] py-4 px-2 flex justify-center">
          {" "}
          <strong>{tituloProceso}</strong>
        </h2>
        <p className="flex text-center px-2 text-pretty  max-w-[630px] h-[120px] truncate max-sm:w-full sm:w-full  md:w-full  lg:w-full  xl:w-full ">
          {descripcionProceso}
        </p>
      </div>
    </>
  );
};
