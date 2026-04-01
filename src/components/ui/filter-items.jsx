"use client"; // Pastikan ada ini jika menggunakan Next.js App Router
import { useState } from "react";
import { Button } from "./button";

export default function FilterItems() {
    // 1. Data kategori (bisa ditambah sesuka hati)
    const categories = ["Semua Items", "Apple", "Oppo","Pixel"];

    
    const [active, setActive] = useState("Semua Items");

    return (
        <div className=" mx-auto p-12  ">
           
            <div className="flex lg:gap-8 gap-5 bg-white dark:bg-neutral-900 border rounded-2xl p-6 lg:p-10 overflow-x-auto no-scrollbar  " >

                {categories.map((item) => (
                    <div
                        key={item}
                        onClick={() => setActive(item)}
                        className={`
                            cursor-pointer lg:px-8 lg:py-4 px-3 py-2 transition-all duration-300 rounded-full whitespace-nowrap lg:text-2xl uppercase
                            ${active === item ? "bg-blue-500 text-white" : "hover:bg-gray-300 text-gray-500"}
                        `}
                    >
                        <span className="font-medium">{item}</span>
                    </div>
                ))}

            </div>
        </div>
    );
}