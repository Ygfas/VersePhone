"use client"; // Pastikan ada ini jika menggunakan Next.js App Router
import { useState } from "react";
import { Button } from "./button";

export default function FilterItems() {
    // 1. Data kategori (bisa ditambah sesuka hati)
    const categories = ["Semua Items", "Elektronik", "Pakaian", "Hobi", "Rumah Tangga", "Otomotif", "Elektronik", "Pakaian", "Hobi"];

    
    const [active, setActive] = useState("Semua Items");

    return (
        <div className=" mx-auto p-12 ">
           
            <div className="flex lg:gap-10 gap-2 bg-white dark:bg-slate-800 border rounded-2xl p-6 lg:p-14 overflow-x-auto no-scrollbar  " >

                {categories.map((item) => (
                    <div
                        key={item}
                        onClick={() => setActive(item)} // 3. Ubah state saat diklik
                        className={`
                            cursor-pointer lg:px-8 lg:py-4 px-3 py-2 transition-all duration-300 rounded-md whitespace-nowrap 
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