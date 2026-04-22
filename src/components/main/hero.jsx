import React, { useMemo } from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";


const PRODUCT_DATA = [
    {
        title: "Apple",
        link: "https://www.apple.com/",
        thumbnail:
            "https://image.thum.io/get/https://www.apple.com",
    },
    {
        title: "Xiaomi",
        link: "https://Xiaomi.com",
        thumbnail:
            "https://image.thum.io/get/https://www.mi.com",
    },
    {
        title: "Vivo",
        link: "https://vivo.com",
        thumbnail:
            "https://image.thum.io/get/https://www.vivo.com",
    },

    {
        title: "Samsung",
        link: "https://image.thum.io/get/https://www.samsung.com",
        thumbnail:
            "https://image.thum.io/get/https://www.samsung.com",
    },
    {
        title: "Poco",
        link: "https://poco.com",
        thumbnail:
            "https://image.thum.io/get/https://www.poco.net",
    },
    {
        title: "Iqoo",
        link: "https://iqoo.com",
        thumbnail:
            "https://image.thum.io/get/https://www.iqoo.com",
    },

    {
        title: "Tecno",
        link: "https://tecno.com",
        thumbnail:
            "https://image.thum.io/get/https://www.tecno-mobile.com",
    },
    {
        title: "Infinix",
        link: "https://infinix.com",
        thumbnail:
            "https://image.thum.io/get/https://www.infinixmobility.com",
    },
    {
        title: "Realme",
        link: "https://realme.com",
        thumbnail:
            "https://image.thum.io/get/https://www.realme.com",
    },
    // {
    //     title: "Huawei",
    //     link: "https://huawei.com",
    //     thumbnail:
    //         "https://image.thum.io/get/https://www.huawei.com",
    // },
    // {
    //     title: "Honor",
    //     link: "https://honor.com",
    //     thumbnail:
    //         "https://image.thum.io/get/https://www.honor.com",
    // },

    // {
    //     title: "Motorola",
    //     link: "https://motorola.com",
    //     thumbnail:
    //         "https://image.thum.io/get/https://www.motorola.com",
    // },
    // {
    //     title: "Red Magic",
    //     link: "https://redmagic.gg",
    //     thumbnail:
    //         "https://image.thum.io/get/https://www.redmagic.gg",
    // },
    // {
    //     title: "Google Pixel",
    //     link: "https://store.google.com",
    //     thumbnail:
    //         "https://image.thum.io/get/https://store.google.com/category/phones",
    // },

];
export default function Hero() {
    // Gunakan useMemo jika data ini nantinya datang dari props/state
    const products = useMemo(() => PRODUCT_DATA, []);

    return <HeroParallax products={products} />;
}