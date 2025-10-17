// src/components/Gallery.jsx
import { useEffect, useRef, useState } from "react";

/** Reemplazá/extendé con tus imágenes reales en /public */
const IMAGES = [
  { src: "/images/pizza-1.jpg", alt: "Prepizzas caseras" },
  { src: "/images/pizza-2.jpg", alt: "Pizzetas listas" },
  { src: "/images/pizza-3.jpg", alt: "Prepizzas caseras" },
  { src: "/images/cebolla.png", alt: "Pizzetas listas" },
  { src: "/images/tomate.png", alt: "Cebolla estilo fugazza" },
  { src: "/images/mixta.png", alt: "Mixta" },
  { src: "/images/pizzeta.png", alt: "Individuales" },
  { src: "/images/pizza-1.jpg", alt: "Al horno o parrilla" },
];

export default function Gallery({ images = IMAGES, title = "Mirá las delicias de la casa" }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  // refs para swipe y para detectar click fuera
  const lightboxRef = useRef(null);
  const touchStart = useRef({ x: 0, y: 0, t: 0 });
  const touchDelta = useRef({ x: 0, y: 0 });

  const openAt = (i) => {
    setIdx(i);
    setOpen(true);
  };
  const close = () => setOpen(false);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  // Teclado: Escape, ←, →
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Cerrar al click/touch fuera (robusto, fase de captura)
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
    touchDelta.current = {
      x: t.clientX - touchStart.current.x,
      y: t.clientY - touchStart.current.y,
    };
  };
  const onTouchEnd = () => {
    const { x, y } = touchDelta.current;
    const dt = Date.now() - touchStart.current.t;
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    const H_THRESHOLD = 50;  // desplazamiento mínimo horizontal
    const V_LIMIT = 60;      // límite vertical para no confundir con scroll
    const TIME_LIMIT = 600;  // swipe rápido (ms)
    if (dt <= TIME_LIMIT && absX > H_THRESHOLD && absY < V_LIMIT) {
      if (x < 0) next();
      else prev();
    }
  };

  return (
    <section id="galeria" className="relative overflow-hidden bg-bg">
      
      <div className="absolute inset-0 z-[1] bg-[url('/texture-2.jpg')] bg-repeat bg-cover opacity-5" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-20 z-[2] bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 z-[2] bg-gradient-to-t from-bg to-transparent" />

      <div className="container relative z-[3] py-14 md:py-20">
        <h2 className="section-title font-serif text-primary text-center">{title}</h2>
        <p className="text-muted mb-6 text-center">Un vistazo a nuestras prepizzas y presentaciones.</p>

        {/* Grid: miniaturas cuadradas uniformes */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <button
              key={i}
              className="group relative rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition cursor-zoom-in"
              onClick={() => openAt(i)}
              aria-label={`Abrir imagen ${i + 1}`}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt || `Imagen ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 select-none pointer-events-none"
                  draggable={false}
                />
              </div>
              <div className="absolute inset-0 ring-1 ring-black/5 group-hover:ring-black/10 transition" />
            </button>
          ))}
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
            <img
              src={images[idx]?.src}
              alt={images[idx]?.alt || "Foto"}
              className="w-full max-h-[80svh] object-contain rounded-2xl shadow-2xl bg-bg select-none"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
            />

            {/* Botón Cerrar (X) */}
            <button
              onClick={close}
              className="absolute -top-3 right-0 md:-right-4 md:-top-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-text grid place-items-center shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Cerrar"
            >
              ✕
            </button>

            {/* Prev / Next */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-text grid place-items-center shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Anterior"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-text grid place-items-center shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Siguiente"
            >
              ›
            </button>

            {/* Indicador */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/85 text-xs text-text">
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
