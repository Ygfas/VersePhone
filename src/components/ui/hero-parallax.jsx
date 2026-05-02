"use client";
import React, { useMemo } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import Link from "next/link";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { LineShadowText } from "./line-shadow-text";
import { AuroraText } from "./aurora-text";
import { TextAnimate } from "./text-animate";


// Menggunakan memo untuk mencegah re-render saat scroll progress berubah
const ProductCard = React.memo(({ product, translate }) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      className="group/product h-65 w-80 md:h-90 md:w-[30rem] relative shrink-0 will-change-transform"
    >
      <Link href={product.link} className="block group-hover/product:shadow-2xl">
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading="lazy" // Lazy load untuk gambar di luar viewport
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300"></div>
      <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white transition-opacity duration-300">
        {product.title}
      </h2>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export const HeroParallax = ({ products }) => {
  const firstRow = useMemo(() => products.slice(0, 5), [products]);
  const secondRow = useMemo(() => products.slice(5, 10), [products]);
  const thirdRow = useMemo(() => products.slice(10, 15), [products]);

  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 0 }; 

  const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
  const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
  const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
  const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
  const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 50]), springConfig);

  return (
    <div
      ref={ref}
      className="2xl:h-[160vh] md:h-[120vh] h-[130vh] py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="will-change-transform"
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard product={product} translate={translateXReverse} key={product.title} />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard product={product} translate={translateX} key={product.title} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
    export const Header = () => {
      return (
        <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full left-0 top-0">
          <h1 className="text-6xl md:text-8xl font-bold dark:text-white text-black">
            <AuroraText>Verse</AuroraText>
            <LineShadowText >Phone</LineShadowText>
          </h1>
          <TextAnimate animation='blurIn' as="h1" className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200 text-neutral-700 font-mono">
           
           Pusat gadget terlengkap yang menghadirkan teknologi terbaru untuk medukung produktivitas dan gaya hidup digital Anda.
           Pusat Smartphone Original dengan Garanasi Resmi 
           
          </TextAnimate>
          
          <div className="mt-10">
            <Link href="/login" passHref legacyBehavior>
              <InteractiveHoverButton className="shadow-lg">
                Belanja Sekarang
              </InteractiveHoverButton>
            </Link>
          </div>
        </div>
      );
    };