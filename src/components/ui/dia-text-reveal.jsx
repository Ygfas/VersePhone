"use client";
import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform
} from "motion/react";
import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#c679c4", "#fa3d1d", "#ffb005", "#e1e1fe", "#0358f7"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (t) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function buildGradient(pos, colors, textColor) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }
  const n = colors.length;
  const parts = [];

  if (bandStart > 0)
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);

  colors.forEach((c, i) => {
    const pct = n === 1 ? pos : bandStart + (i / (n - 1)) * BAND_HALF * 2;
    parts.push(`${c} ${pct.toFixed(2)}%`);
  });

  if (bandEnd < 100)
    parts.push(`transparent ${bandEnd.toFixed(2)}%`, `transparent 100%`);

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function measureWidths(el, texts) {
  if (!el || !el.parentElement) return [];
  const ghost = el.cloneNode();
  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });
  el.parentElement.appendChild(ghost);
  const widths = texts.map((t) => {
    ghost.textContent = t;
    return ghost.getBoundingClientRect().width;
  });
  ghost.remove();
  return widths;
}

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "var(--foreground)",
  duration = 1.5,
  delay = 0,
  repeat = false,
  repeatDelay = 0.5,
  startOnView = true,
  once = false, // Diubah ke false agar bisa trigger berulang kali
  className,
  fixedWidth = false,
  ...props
}) {
  const texts = Array.isArray(text) ? text : [text];
  const isMulti = texts.length > 1;
  const prefersReducedMotion = useReducedMotion();

  const spanRef = useRef(null);
  const optsRef = useRef({
    colors,
    textColor,
    duration,
    delay,
    repeat,
    repeatDelay,
    texts,
  });

  optsRef.current = {
    colors,
    textColor,
    duration,
    delay,
    repeat,
    repeatDelay,
    texts,
  };

  const indexRef = useRef(0);
  const timerRef = useRef(undefined);
  const stopRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState([]);

  const sweepPos = useMotionValue(SWEEP_START);
  const backgroundImage = useTransform(sweepPos, (pos) =>
    buildGradient(pos, optsRef.current.colors, optsRef.current.textColor)
  );

  // Kunci: once: false memantau elemen keluar-masuk viewport
  const isInView = useInView(spanRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !isMulti) return;
    setMeasuredWidths(measureWidths(el, texts));
  }, [text, isMulti, texts]);

  const playAnimation = () => {
    const { duration, delay, repeat, repeatDelay, texts } = optsRef.current;

    // Reset ke posisi awal setiap kali mulai
    sweepPos.set(SWEEP_START);

    const controls = animate(sweepPos, SWEEP_END, {
      duration,
      delay,
      ease: sweepEase,
      onComplete() {
        if (!repeat) return;
        timerRef.current = setTimeout(() => {
          const next = (indexRef.current + 1) % texts.length;
          indexRef.current = next;
          setActiveIndex(next);
          playAnimation();
        }, repeatDelay * 1000);
      },
    });

    stopRef.current = () => controls.stop();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      sweepPos.set(SWEEP_END);
      return;
    }

    if (isInView) {
      // Mainkan animasi saat masuk layar
      playAnimation();
    } else {
      // Opsional: Reset posisi saat keluar layar agar siap diputar lagi
      sweepPos.set(SWEEP_START);
      stopRef.current?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      stopRef.current?.();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isInView, prefersReducedMotion]);

  const fixedW =
    isMulti && fixedWidth && measuredWidths.length > 0
      ? Math.max(...measuredWidths)
      : undefined;

  const animatedW =
    isMulti && !fixedWidth && measuredWidths[activeIndex] != null
      ? measuredWidths[activeIndex]
      : undefined;

  return (
    <motion.span
      ref={spanRef}
      className={cn("inline-block align-bottom leading-[100%] text-inherit", className)}
      style={{
        transform: "translateY(-2px)",
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundImage,
        ...(isMulti && {
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "text-center",
          ...(fixedW != null && { width: fixedW }),
        }),
      }}
      animate={animatedW != null ? { width: animatedW } : undefined}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {texts[activeIndex]}
      <div className="w-40 h-1.5 bg-blue-600 mx-auto rounded-full mt-5" />
    </motion.span>
  );
}