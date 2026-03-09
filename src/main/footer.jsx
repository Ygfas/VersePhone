"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiGithub, FiTwitter, FiLinkedin, FiInstagram, FiArrowRight } from "react-icons/fi";
import { cn } from "@/lib/utils"; // Pastikan utilitas ini ada

// 1. Variasi Animasi Container Utama (Stagger Effect)
const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1], // Custom Cubic Bezier untuk kesan "pop"
            staggerChildren: 0.1, // Jeda waktu muncul antar elemen anak
        },
    },
};

// 2. Variasi Animasi Elemen Anak
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// 3. Animasi Hover untuk Ikon Sosial Media
const socialIconVariants = {
    hover: {
        y: -5,
        scale: 1.1,
        transition: { type: "spring", stiffness: 400, damping: 10 },
    },
};

// Data Navigasi & Sosial Media (Bisa dipindah ke file terpisah)
const footerLinks = [
    { name: "Product", links: ["Features", "Integrations", "Pricing", "Status"] },
    { name: "Company", links: ["About Us", "Careers", "Press", "News"] },
    { name: "Resources", links: ["Blog", "Newsletter", "Events", "Help Center"] },
];

const socialMedias = [
    { icon: FiGithub, href: "https://github.com", name: "GitHub" },
    { icon: FiTwitter, href: "https://twitter.com", name: "Twitter" },
    { icon: FiLinkedin, href: "https://linkedin.com", name: "LinkedIn" },
    { icon: FiInstagram, href: "https://instagram.com", name: "Instagram" },
];

export const InteractiveFooter = ({ className }) => {
    return (
        <motion.footer
            className={cn(
                "bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800",
                className
            )}
            // Memicu animasi saat footer masuk ke viewport (saat di-scroll ke bawah)
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }} // Muncul saat 20% footer terlihat
            variants={containerVariants}
        >
            <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-12">

                    {/* Section 1: Brand & Newsletter */}
                    <motion.div variants={itemVariants} className="col-span-2 md:col-span-3 pr-8">
                        <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Interactive<span className="text-purple-600">.</span>
                        </Link>
                        <p className="mt-4 text-neutral-600 dark:text-neutral-400 max-w-md text-sm leading-relaxed">
                            Stay ahead with our latest insights. Subscribe to our newsletter for exclusive updates and industry news.
                        </p>
                        <div className="mt-6 flex max-w-sm items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-1 shadow-inner shadow-neutral-100 dark:shadow-black/20">
                            <input
                                type="email"
                                placeholder="you@email.com"
                                className="w-full bg-transparent px-4 py-2 text-sm text-neutral-900 outline-none dark:text-white placeholder:text-neutral-400"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex size-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-neutral-900"
                            >
                                <FiArrowRight />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Section 2: Link Navigasi (Staggered Load) */}
                    {footerLinks.map((section, idx) => (
                        <motion.div key={section.name} variants={itemVariants} className="col-span-1">
                            <h4 className="font-semibold text-neutral-950 dark:text-neutral-100 mb-5 text-sm uppercase tracking-wider">
                                {section.name}
                            </h4>
                            <ul className="space-y-3.5">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="group flex items-center gap-1.5 text-sm text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                                        >
                                            <motion.span
                                                className="h-px w-0 bg-purple-600 group-hover:w-3"
                                                transition={{ duration: 0.3 }}
                                            />
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Section 3: Bottom Bar & Socials */}
                <motion.div
                    variants={itemVariants}
                    className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                        © {new Date().getFullYear()} Interactive Inc. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4">
                        {socialMedias.map((social) => (
                            <motion.a
                                key={social.name}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={socialIconVariants}
                                whileHover="hover"
                                aria-label={social.name}
                                className="flex size-10 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors shadow-sm"
                            >
                                <social.icon className="size-5" />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.footer>
    );
};