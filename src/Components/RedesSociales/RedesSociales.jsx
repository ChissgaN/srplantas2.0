import React, { useState } from "react";

import facebook from "/footer/facebook.svg";
import whatssap from "/footer/whatssap2.svg";
import arrow from "/footer/arrowequal.svg";
export const RedesSociales = () => {
  const [visible, setVisible] = useState(true);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
   
    <>
    {visible && (
      <div className="fixed md:left-0 top-[270px] max-sm:right-0 sm:right-0">
        <div className="flex items-center ">
          <a
            href="https://www.facebook.com/agriculturaespecializadagt"
            target="_blank"
            className="block"
          >
            <div className=" group relative transition-all bg-[#4460A0] hover:bg-[#4460A0] hover:w-[140px] w-12 h-10 flex items-center justify-center hover:max-md:rounded-l-md hover:md:rounded-r-md hover:sm-rounded-l-md">
              <span className="text-[0px] group-hover:text-[12px] group-hover:text-white pl-2 max-sm:pr-2 md:hidden ms:hidden max-sm:block  sm:pl-2 max-md:block sm:pr-2">
                FACEBOOK
              </span>
              <img
                src={facebook}
                className=" relative transition-all w-6"
                alt="red social Whatssap"
              />
              <span className="text-[0px] group-hover:text-[12px] group-hover:text-white pl-2 md:block sm:hidden max-sm:hidden">
                FACEBOOK
              </span>
            </div>
          </a>
        </div>
      </div>
      )}

      {visible && (
      <div className="fixed md:left-0 top-[309px] max-sm:right-0 sm:right-0">
        <div className="flex items-center ">
          <a
            href="https://wa.me/+50233332343"
            target="_blank"
            rel="noopener noreferrer"
            className=" block"
          >
            <div
              className="group relative transition-all bg-[#67C15E] hover:bg-[#67C15E] hover:w-[140px] w-12 h-10 flex items-center justify-center
            hover:max-md:rounded-l-md
            hover:md:rounded-r-md
            hover:sm-rounded-l-md
            "
            >
              <span className="text-[0px] group-hover:text-[12px] group-hover:text-white pl-2 max-sm:pr-2 md:hidden ms:hidden max-sm:block  sm:pl-2 max-md:block sm:pr-2">
                WHATSAPP
              </span>
              <img
                src={whatssap}
                className=" relative transition-all w-6"
                alt="red social Whatssap"
              />
              <span className="text-[0px] group-hover:text-[12px] group-hover:text-white pl-2 md:block sm:hidden max-sm:hidden">
                WHATSAPP
              </span>
            </div>
          </a>
        </div>
      </div>
      )}
      
      <button
        className="fixed md:left-0 top-[349px] z-30 max-sm:right-0 sm:right-0 bg-slate-300 hover:bg-slate-400 w-4 hover:w-8 transition-all"
        onClick={toggleVisibility}
      >
        <img src={arrow} alt="flecha Desplegable Redes Sociales" className="w-6" />
      </button>

    </>
  );
};
