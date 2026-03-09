'use client'
import React, { useState, useEffect } from 'react';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser, IconBrandProducthunt } from "@tabler/icons-react";

// Definisikan navItems di luar komponen agar tidak di-recreate setiap render
const navItems = [
    {
        name: "Home",
        link: "/",
        icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Product",
        link: "#",
        icon: <IconBrandProducthunt className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "About",
        link: "#about",
        icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Contact",
        link: "#contact",
        icon: <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
];

export default function Navbar() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Ambil inisialisasi awal dari class <html>
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains("dark"));
        };

        checkTheme();

        // Pantau perubahan tema (baik dari tombol maupun sistem)
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative w-full">
            {/* Bungkus toggler agar posisinya pas, misalnya di pojok kanan atas */}
            <div className="fixed top-6 right-6 z-[5000]">
                <AnimatedThemeToggler
                    className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-neutral-200 dark:border-white/[0.2] shadow-lg"
                />
            </div>

            <FloatingNav navItems={navItems} />
        </div>
    );
}