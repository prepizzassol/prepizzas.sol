import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carrousel() {
  const slides = [
    {
      src: "/images/pizza-1.webp",
      alt: "Prepizzas caseras",
      caption: "Listas para horno o parrilla 🔥",
    },
    {
      src: "/images/pizza-2.webp",
      alt: "Pizzetas listas",
      caption: "Aptas freezer ❄️",
    },
    {
      src: "/images/pizza-3.webp",
      alt: "Pizzas artesanales",
      caption: "Hacé tu pedido!",
    },
  ];

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      effect="fade"
      loop
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      className="rounded-2xl shadow-2xl bg-white"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={i} className="p-2 bg-accent">
          <div className="relative">
            <img
              src={s.src}
              alt={s.alt}
              className="w-full h-[400px] object-cover rounded-2xl cursor-pointer"
              loading="preload"
            />
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent text-white p-4 font-hand text-xl text-center">
              {s.caption}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
