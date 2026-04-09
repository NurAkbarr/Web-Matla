import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * CoverflowCarousel
 * Props:
 *   images: string[]  — list of full image URLs
 *   autoPlay?: number — autoplay interval in ms (default 3500), 0 to disable
 */
const CoverflowCarousel = ({ images = [], autoPlay = 3500 }) => {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const timerRef = useRef(null);

  const total = images.length;

  const goTo = useCallback(
    (index) => {
      if (isAnimating || total === 0) return;
      setIsAnimating(true);
      setCurrent(((index % total) + total) % total);
      setTimeout(() => setIsAnimating(false), 450);
    },
    [isAnimating, total],
  );

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setInterval(next, autoPlay);
    return () => clearInterval(timerRef.current);
  }, [next, autoPlay, total]);

  const pauseAutoPlay = () => clearInterval(timerRef.current);
  const resumeAutoPlay = () => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setInterval(next, autoPlay);
  };

  if (total === 0) return null;

  // Build up to 5 visible cards: far-left, left, center, right, far-right
  const getSlide = (offset) => ({
    index: (current + offset + total) % total,
    offset,
  });

  const visible =
    total === 1
      ? [getSlide(0)]
      : total === 2
        ? [getSlide(0), getSlide(1)]
        : [getSlide(-2), getSlide(-1), getSlide(0), getSlide(1), getSlide(2)];

  const getStyle = (offset) => {
    const abs = Math.abs(offset);
    if (abs > 2) return { display: "none" };

    const styles = {
      0: {
        transform: "translateX(-50%) scale(1) rotateY(0deg)",
        zIndex: 10,
        opacity: 1,
        filter: "none",
      },
      1: {
        transform: "translateX(calc(-50% + 55%)) scale(0.78) rotateY(-18deg)",
        zIndex: 7,
        opacity: 0.85,
        filter: "brightness(0.78)",
      },
      "-1": {
        transform: "translateX(calc(-50% - 55%)) scale(0.78) rotateY(18deg)",
        zIndex: 7,
        opacity: 0.85,
        filter: "brightness(0.78)",
      },
      2: {
        transform: "translateX(calc(-50% + 92%)) scale(0.6) rotateY(-28deg)",
        zIndex: 5,
        opacity: 0.55,
        filter: "brightness(0.6)",
      },
      "-2": {
        transform: "translateX(calc(-50% - 92%)) scale(0.6) rotateY(28deg)",
        zIndex: 5,
        opacity: 0.55,
        filter: "brightness(0.6)",
      },
    };

    return styles[offset] || { display: "none" };
  };

  return (
    <div
      className="coverflow-root"
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      {/* Stage */}
      <div className="coverflow-stage" style={{ perspective: "1200px" }}>
        {visible.map(({ index, offset }) => (
          <div
            key={`slide-${offset}`}
            className="coverflow-card"
            style={getStyle(offset)}
            onClick={() => offset !== 0 && goTo(index)}
          >
            <img
              src={images[index]}
              alt={`Slide ${index + 1}`}
              className="coverflow-img"
              draggable={false}
            />
            {/* Reflection */}
            <div className="coverflow-reflection">
              <img
                src={images[index]}
                alt=""
                className="coverflow-img"
                draggable={false}
                aria-hidden
              />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      {total > 1 && (
        <>
          <button
            className="coverflow-btn coverflow-btn--prev"
            onClick={prev}
            aria-label="Sebelumnya"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            className="coverflow-btn coverflow-btn--next"
            onClick={next}
            aria-label="Berikutnya"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="coverflow-dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`coverflow-dot ${i === current ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      <style>{`
        .coverflow-root {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          padding: 1rem 0 3.5rem;
          user-select: none;
        }

        .coverflow-stage {
          position: relative;
          width: 100%;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .coverflow-card {
          position: absolute;
          left: 50%;
          width: clamp(200px, 38vw, 360px);
          aspect-ratio: 3/4;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.45s cubic-bezier(0.25,0.46,0.45,0.94),
                      opacity 0.45s ease,
                      filter 0.45s ease;
          will-change: transform, opacity;
          box-shadow: 0 24px 60px rgba(0,0,0,0.3);
        }

        .coverflow-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
        }

        .coverflow-reflection {
          position: absolute;
          left: 0; right: 0;
          bottom: -100%;
          height: 100%;
          transform: scaleY(-1);
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 65%);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 65%);
          pointer-events: none;
        }

        .coverflow-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          background: rgba(255,255,255,0.92);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18);
          color: #1b4137;
          z-index: 20;
          transition: background 0.2s, transform 0.2s;
        }

        .coverflow-btn:hover {
          background: #1b4137;
          color: white;
          transform: translateY(-50%) scale(1.08);
        }

        .coverflow-btn--prev { left: 8px; }
        .coverflow-btn--next { right: 8px; }

        .coverflow-dots {
          position: absolute;
          bottom: 0.75rem;
          width: 100%;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .coverflow-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(27,65,55,0.25);
          border: none;
          cursor: pointer;
          transition: background 0.3s, width 0.3s;
          padding: 0;
        }

        .coverflow-dot.active {
          background: #1b4137;
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 640px) {
          .coverflow-stage { height: 340px; overflow: hidden; }
          .coverflow-card { width: clamp(140px, 62vw, 230px); }
          .coverflow-btn { width: 34px; height: 34px; }
        }
      `}</style>
    </div>
  );
};

export default CoverflowCarousel;
