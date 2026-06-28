// components/AIPortfolioHero.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

const portfolioCards = [
  { src: "/portfolio-2.webp", alt: "Portfolio preview one" },
  { src: "/portfolio-1.webp", alt: "Portfolio preview two" },
  { src: "/portfolio-3.webp", alt: "Portfolio preview three" },
];

const desktopSlots = {
  center: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1.03,
    zIndex: 30,
    opacity: 1,
  },
  left: {
    x: -390,
    y: 65,
    rotate: -6,
    scale: 0.86,
    zIndex: 10,
    opacity: 0.92,
  },
  right: {
    x: 390,
    y: 65,
    rotate: 6,
    scale: 0.86,
    zIndex: 10,
    opacity: 0.92,
  },
};

const mobileSlots = {
  center: {
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    zIndex: 30,
    opacity: 1,
  },
  left: {
    x: -150,
    y: 50,
    rotate: -7,
    scale: 0.72,
    zIndex: 10,
    opacity: 0.32,
  },
  right: {
    x: 150,
    y: 50,
    rotate: 7,
    scale: 0.72,
    zIndex: 10,
    opacity: 0.32,
  },
};

export default function AIPortfolioHero() {
  const [activeCard, setActiveCard] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, {
    stiffness: 80,
    damping: 26,
  });

  const parallax = useTransform(smoothMouseX, [-600, 600], [-12, 12]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveCard((current) => (current + 1) % portfolioCards.length);
    }, 2700);

    return () => clearInterval(timer);
  }, [isPaused]);

  const getSlot = (index) => {
    const position =
      (index - activeCard + portfolioCards.length) % portfolioCards.length;

    if (position === 0) return "center";
    if (position === 1) return "right";
    return "left";
  };

  return (
    <section
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left - rect.width / 2);
      }}
      className="relative overflow-hidden bg-[#fbfbf8] px-5 pt-[118px] text-[#0b0b0c] md:px-8 md:pt-[128px] xl:px-12"
    >
      {/* Clean UXfolio-style grid */}
      <div className="pointer-events-none absolute " />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#fbfbf8]" />

      <div className="relative z-10 mx-auto max-w-[1500px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto text-center"
        >
          <h1 className="mx-auto max-w-[1180px] text-[44px] font-black leading-[1.04] tracking-[-2.4px] md:text-[76px] lg:text-[88px]">
            Build the AI portfolio that
            <br />
            gets you{" "}
            <span className="relative inline-block px-1">
              hired
              <HandSketch />
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-9 flex justify-center"
          >
            <Link
              href="/signup"
              className="group inline-flex h-[58px] items-center gap-3 rounded-[14px] bg-[#0b0b0c] px-8 text-[17px] font-black text-white shadow-[0_22px_55px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:bg-[#111827]"
            >
              Get started for free
              <ArrowRight
                size={21}
                strokeWidth={2.5}
                className="transition duration-300 group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Portfolio device carousel */}
        <motion.div
          style={{ x: parallax }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative mx-auto mt-18 h-[435px] max-w-[1180px] md:mt-22 md:h-[470px] lg:h-[500px]"
        >
          {/* Desktop */}
          {portfolioCards.map((card, index) => {
            const slot = getSlot(index);

            return (
              <motion.div
                key={card.src}
                initial={false}
                animate={{
                  x: desktopSlots[slot].x,
                  y: desktopSlots[slot].y,
                  rotate: desktopSlots[slot].rotate,
                  scale: desktopSlots[slot].scale,
                  opacity: desktopSlots[slot].opacity,
                }}
                transition={{
                  duration: 0.95,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  zIndex: desktopSlots[slot].zIndex,
                }}
                className="absolute left-1/2 top-0 hidden w-[540px] -translate-x-1/2 lg:block"
              >
                <DevicePreview
                  src={card.src}
                  alt={card.alt}
                  isCenter={slot === "center"}
                />
              </motion.div>
            );
          })}

          {/* Mobile / tablet */}
          {portfolioCards.map((card, index) => {
            const slot = getSlot(index);

            return (
              <motion.div
                key={`${card.src}-mobile`}
                initial={false}
                animate={{
                  x: mobileSlots[slot].x,
                  y: mobileSlots[slot].y,
                  rotate: mobileSlots[slot].rotate,
                  scale: mobileSlots[slot].scale,
                  opacity: mobileSlots[slot].opacity,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  zIndex: mobileSlots[slot].zIndex,
                }}
                className="absolute left-1/2 top-0 block w-[310px] -translate-x-1/2 sm:w-[400px] md:w-[490px] lg:hidden"
              >
                <DevicePreview
                  src={card.src}
                  alt={card.alt}
                  isCenter={slot === "center"}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function HandSketch() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-5 left-1/2 z-[-1] h-[34px] w-[160%] -translate-x-1/2 md:-bottom-7 md:h-[46px]"
      viewBox="0 0 310 72"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M12 40 C 58 16, 118 18, 168 30 C 220 42, 263 43, 298 24"
        stroke="#DFFF22"
        strokeWidth="18"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          duration: 0.85,
          delay: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      <motion.path
        d="M22 52 C 82 34, 140 38, 190 47 C 238 56, 273 48, 304 38"
        stroke="#DFFF22"
        strokeWidth="9"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.95 }}
        transition={{
          duration: 0.75,
          delay: 0.78,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </svg>
  );
}
function DevicePreview({ src, alt, isCenter }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        rotate: 0,
        scale: isCenter ? 1.018 : 1.035,
      }}
      transition={{
        duration: 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative rounded-[42px] bg-[#0b0b0c] p-[7px] shadow-[0_30px_90px_rgba(15,23,42,0.18)]"
    >
      {/* Metallic outside outline */}
      <div className="pointer-events-none absolute inset-0 rounded-[42px] ring-1 ring-black/20" />

      {/* Inner device screen */}
      <div className="relative overflow-hidden rounded-[35px] bg-[#111] p-[4px]">
        {/* Real dynamic island cutout */}
        <div className="absolute left-1/2 top-[14px] z-40 h-[14px] w-[66px] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.28)] md:h-[15px] md:w-[76px]" />

        {/* Tiny camera shine */}
        <div className="absolute left-[calc(50%+22px)] top-[18px] z-50 h-[5px] w-[5px] rounded-full bg-white/20 blur-[0.2px] md:left-[calc(50%+27px)] md:top-[19px]" />

        {/* Static screen content - no motion inside */}
        <div className="relative h-[390px] overflow-hidden rounded-[30px] bg-[#f3f3f0] sm:h-[420px] md:h-[455px] lg:h-[470px]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={isCenter}
            sizes="(max-width: 640px) 310px, (max-width: 768px) 400px, (max-width: 1024px) 490px, 540px"
            draggable={false}
            className="select-none object-cover object-top"
          />
        </div>
      </div>
    </motion.div>
  );
}