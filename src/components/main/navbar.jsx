'use client'
import React, { useState, useEffect } from 'react';
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconMessage, IconUser, IconBrandProducthunt } from "@tabler/icons-react";
import { StickyBanner } from '../ui/sticky-banner';
import Link from 'next/link';



// Definisikan navItems di luar komponen agar tidak di-recreate setiap render
const navItems = [
    {
        name: "Home",
        link: "/",
        icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Products",
        link: "/products",
        icon: <IconBrandProducthunt className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "About",
        link: "/about",
        icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
        name: "Contact",
        link: "/contacts",
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


        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative">

            <div className="relative flex lg:h-[9vh] h-[8vh]  flex-col overflow-y-auto ">
                <StickyBanner className="bg-gradient-to-b from-red-400 to-red-600 z-[60]">
                    <p className="mx-0 max-w-[90%] text-white drop-shadow-md ">
                        Announcing $10M seed funding from project mayhem ventures.{" "}
                        <Link href="#" className="transition duration-200 hover:underline">
                            Read announcement
                        </Link>
                    </p>
                </StickyBanner>

            </div>


            <div className="fixed top-6 right-6 z-[55]">

               
            </div>

            <FloatingNav navItems={navItems} />
        </div>
    );
}
