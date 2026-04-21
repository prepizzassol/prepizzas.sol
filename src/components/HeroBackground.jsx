import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

export default function HeroBackground() {
  const slides = [
    "/images/hero-pizza-1.jpeg",
    "/images/hero-pizza-2.jpeg",
    "/images/hero-pizza-3.jpeg",
    "/images/hero-pizza-4.jpeg",
  ];

  return (
    <Swiper
      modules={[Autoplay, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      effect="fade"
      loop
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      className="w-full h-full"
    >
      {slides.map((src, i) => (
        <SwiperSlide key={i} className="w-full h-full">
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
