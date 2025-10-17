import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Carrousel() {
  const slides = [
    { base: "pizza-1", alt: "Prepizzas caseras", caption: "Listas para horno o parrilla 🔥" },
    { base: "pizza-2", alt: "Pizzetas listas", caption: "Aptas freezer ❄️" },
    { base: "pizza-3", alt: "Pizzas artesanales", caption: "Hacé tu pedido!" },
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
      className="rounded-2xl shadow-2xl bg-white"
    >
      {slides.map((s, i) => {
        const sets = imgSrcSets(s.base);
        const isFirst = i === 0;
        return (
          <SwiperSlide key={i} className="p-2 bg-accent">
            <div className="relative">
              <picture>
                <source type="image/webp" srcSet={sets.webp} sizes={sizes} />
                <img
                  src={sets.fallback}
                  alt={s.alt}
                  sizes={sizes}
                  width="1200"
                  height="675"
                  className="w-full h-[400px] object-cover rounded-2xl cursor-pointer"
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "auto"}
                  decoding={isFirst ? "sync" : "async"}
                />
              </picture>

              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent text-white p-4 font-hand text-xl text-center">
                {s.caption}
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
