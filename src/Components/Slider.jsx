import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import sembrar from "../assets/agricultura/sembrar.webp";
import vegetales from "../assets/agricultura/flores.webp";
import girasoles from "../assets/agricultura/girasol.webp";
import Verduras from "../assets/agricultura/verduras1.webp";



function SliderImg() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="w-full mt-16 md:h-[450px] lg:h-[500px]  ">
      <Slider {...settings}>

        <div className="my-2 flex w-screen">
          <img
            src={sembrar}
             className="max-sm:h-[290px] sm:h-[380px] w-full h-[250px] md:h-[450px] lg:h-[500px] "
            alt="verduras"
          />
        </div>
        <div className="my-2 flex">
          <img
            src={girasoles}
             className="max-sm:h-[290px] sm:h-[380px] w-full h-[250px] md:h-[450px] lg:h-[500px] "
            alt="cultivar"
          />
        </div>
        <div className="my-2 flex">
          <img
            src={Verduras}
             className="max-sm:h-[290px] sm:h-[380px] w-full h-[250px] md:h-[450px] lg:h-[500px] "
            alt="verduras"
          />
        </div>
        <div className="my-2 flex">
          <img
            src={vegetales}
             className="max-sm:h-[290px] sm:h-[380px] w-full h-[250px] md:h-[450px] lg:h-[500px] "
            alt="cultivar"
          />
        </div>
      </Slider>
    </div>
  );
}

export default SliderImg;
