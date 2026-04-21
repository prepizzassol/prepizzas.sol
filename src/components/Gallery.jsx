// src/components/Gallery.jsx
import { useEffect, useRef, useState } from "react";

const IMAGES = [
  { src: "/images/pizzetta-cebolla-2.webp", alt: "Pizzetas listas" },
  { src: "/images/prepizza-cebolla-2.webp",  alt: "Cebolla estilo fugazza" },
  { src: "/images/mixta-2.webp",   alt: "Mixta" },
  { src: "/images/prepizza-tomate-1.webp", alt: "Individuales" },
  { src: "/images/tomate-individuales.webp", alt: "Prepizzas caseras" },
  { src: "/images/mixta-3.webp", alt: "Prepizzas caseras" },
  { src: "/images/pizzeta-tomate.webp", alt: "Pizzetas listas" },
  { src: "/images/prepizzas-1", alt: "Al horno o parrilla" },
];

/** Helpers para srcset/sizes */
const makeBase = (path) => path.replace(/\.webp$/i, ""); // "/images/tomate"
const thumbSizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";
const viewSizes  = "90vw"; // lightbox ocupa ~90% del ancho

const buildSets = (base) => ({
  webp: `${base}-480.webp 480w, ${base}-768.webp 768w, ${base}-1200.webp 1200w`,
  // Fallback razonable
  fallback: `${base}-768.webp`,
});

export default function Gallery({ images = IMAGES, title = "Mirá las delicias de la casa" }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const lightboxRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const touchDelta = useRef({ x: 0, y: 0 });

  const openAt = (i) => { setIdx(i); setOpen(true); };
  const close = () => setOpen(false);
  const prev  = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next  = () => setIdx((i) => (i + 1) % images.length);

  // Teclado
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Bloquear scroll del body cuando está abierto
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prevOverflow; };
  }, [open]);

  // Cerrar al click/touch fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const box = lightboxRef.current;
      if (!box) return;
      const target = e.target;
      if (!box.contains(target)) setOpen(false);
    };
    window.addEventListener("pointerdown", handler, true);
    window.addEventListener("click", handler, true);
    return () => {
      window.removeEventListener("pointerdown", handler, true);
      window.removeEventListener("click", handler, true);
    };
  }, [open]);

  // Swipe en lightbox
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY, t: Date.now() };
    touchDelta.current = { x: 0, y: 0 };
  };
  const onTouchMove = (e) => {
    const t = e.touches[0];
    touchDelta.current = { x: t.clientX - touchStart.current.x, y: t.clientY - touchStart.current.y };
  };
  const onTouchEnd = () => {
    const { x, y } = touchDelta.current;
    const dt = Date.now() - touchStart.current.t;
    const absX = Math.abs(x), absY = Math.abs(y);
    if (dt <= 600 && absX > 50 && absY < 60) { x < 0 ? next() : prev(); }
  };

  // Prefetch muy liviano de next/prev al cambiar idx (mejora UX, no afecta PSI)
  useEffect(() => {
    if (!open) return;
    const preload = (i) => {
      const img = images[i];
      if (!img) return;
      const base = makeBase(img.src);
      const pre = new Image();
      pre.decoding = "async";
      pre.src = `${base}-1200.webp`;
    };
    preload((idx + 1) % images.length);
    preload((idx - 1 + images.length) % images.length);
  }, [idx, open, images]);

  return (
    <section id="galeria" className="relative overflow-hidden bg-bg border-b-[8px] border-text">
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-[2] bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-[2] bg-gradient-to-t from-bg to-transparent" />

      <div className="container relative z-[3] py-16 md:py-24 text-center">
        <h2 className="font-display text-text text-5xl md:text-7xl drop-shadow-[4px_4px_0_rgba(230,57,70,1)] -rotate-1 inline-block mb-6">
          {title}
        </h2>
        <br />
        <p className="text-text font-bold text-xl inline-block bg-yellow p-2 neo-border neo-shadow-sm rounded-xl rotate-1 mb-10">Un vistazo a nuestras delicias.</p>

        {/* Grid: miniaturas cuadradas optimizadas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => {
            const base = makeBase(img.src);
            const sets = buildSets(base);
            return (
              <button
                key={i}
                className="group relative overflow-hidden bg-white neo-brutal neo-shadow-sm neo-shadow-hover transition cursor-zoom-in"
                onClick={() => openAt(i)}
                aria-label={`Abrir imagen ${i + 1}`}
              >
                <div className="aspect-square overflow-hidden border-b-[3px] border-text">
                  <picture>
                    <source type="image/webp" srcSet={sets.webp} sizes={thumbSizes} />
                    <img
                      src={sets.fallback}
                      alt={img.alt || `Imagen ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                      draggable={false}
                    />
                  </picture>
                </div>
                <div className="absolute inset-0 ring-1 ring-black/5 group-hover:bg-yellow/20 transition pointer-events-none" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <div
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            ref={lightboxRef}
            className="relative max-w-6xl w-full"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Imagen principal en alta (optimizada) */}
            {open && images[idx] && (() => {
              const base = makeBase(images[idx].src);
              const sets = buildSets(base);
              return (
                <picture>
                  <source type="image/webp" srcSet={sets.webp} sizes={viewSizes} />
                  <img
                    src={`${base}-1200.webp`}
                    alt={images[idx].alt || "Foto"}
                    className="w-full max-h-[80svh] object-contain rounded-[2rem] neo-border neo-shadow-lg bg-bg select-none"
                    draggable={false}
                    decoding="async"
                    fetchpriority="high"
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </picture>
              );
            })()}

            {/* Botón Cerrar (X) */}
            <button
              onClick={close}
              className="absolute -top-3 right-0 md:-right-4 md:-top-4 w-12 h-12 rounded-full bg-accent text-white font-bold text-xl neo-border neo-shadow-sm neo-shadow-hover grid place-items-center focus:outline-none"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-2 md:-left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow text-text text-2xl font-bold neo-border neo-shadow-sm neo-shadow-hover grid place-items-center focus:outline-none"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 md:-right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-yellow text-text text-2xl font-bold neo-border neo-shadow-sm neo-shadow-hover grid place-items-center focus:outline-none"
              aria-label="Siguiente"
            >
              ›
            </button>

            {/* Indicador */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-white neo-border neo-shadow-sm font-bold text-text">
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
