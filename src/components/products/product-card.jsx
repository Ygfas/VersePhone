'use client'
import { motion } from "framer-motion";

export default function ProductCard({ product, onClick }) {
    return (
        <motion.div
            layoutId={`card-${product.id}`}
            onClick={onClick}
            className="bg-card rounded-2xl p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
            whileHover={{ y: -4 }}
        >
            <div className="aspect-[3/4] flex items-center justify-center p-4">
                <motion.img
                    layoutId={`image-${product.id}`}
                    src={product.image}
                    alt={product.title}
                    className="h-full w-auto object-contain"
                />
            </div>
            <div className="mt-3">
                <motion.h3
                    layoutId={`title-${product.id}`}
                    className="font-semibold text-card-foreground text-base"
                >
                    {product.title}
                </motion.h3>
                <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-promo text-promo-foreground font-medium">
                    {product.subtitle}
                </span>
            </div>
        </motion.div>
    );
}