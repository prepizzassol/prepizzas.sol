import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carrousel() {
  const slides = [
    { base: "prepizza-cebolla-1", alt: "Prepizzas caseras", caption: "Listas para horno o parrilla 🔥" },
    { base: "prepizza-tomate-1", alt: "Prepizzas caseras", caption: "Hacé tu pedido!" },
    { base: "pizzeta-cebolla-1", alt: "Pizzetas listas", caption: "Listas para horno o parrilla 🔥" },
    { base: "mixta-1", alt: "Prepizzas caseras", caption: "Aptas freezer ❄️" },
  ];

  const sizes = "(max-width: 768px) 100vw, 1200px";
  const imgSrcSets = (base) => ({
    webp: `/images/${base}-480.webp 480w, /images/${base}-768.webp 768w, /images/${base}-1200.webp 1200w`,
    fallback: `/images/${base}-1200.webp`,
  });

  return (
    <Swiper
      modules={[Autoplay, Pagination, EffectFade]}
      spaceBetween={0}
      slidesPerView={1}
      effect="fade"
      loop
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      className="bg-white"
    >
      {slides.map((s, i) => {
        const sets = imgSrcSets(s.base);
        const isFirst = i === 0;
        return (
          <SwiperSlide key={i} className="bg-white">
            <div className="relative">
              <picture>
                <source type="image/webp" srcSet={sets.webp} sizes={sizes} />
                <img
                  src={sets.fallback}
                  alt={s.alt}
                  sizes={sizes}
                  width="1200"
                  height="675"
                  className="w-full aspect-[4/5] md:h-[400px] object-cover cursor-pointer"
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding={isFirst ? "sync" : "async"}
                />
              </picture>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
