'use client'
import FlowingMenu from "@/components/ui/FlowingMenu"

export default function abouts(){
    // const demoItems = [
    //     { link: '#', text: 'Mojae', image: 'https://picsum.photos/600/400?random=1' },
    //     { link: '#', text: 'Sonoma', image: 'https://picsum.photos/600/400?random=2' },
    //     { link: '#', text: 'Monterey', image: 'https://picsum.photos/600/400?random=3' },
    //     { link: '#', text: 'Sequoia', image: 'https://picsum.photos/600/400?random=4' }
    // ];

    const demoItems = [
        { link: "#", text: "Samsung", image: "/brand/samsung.jpg" },
        { link: "#", text: "Apple", image: "/brand/iphone.jpg" },
        { link: "#", text: "Xiaomi", image: "/brand/Xiaomi-logo.png" },
        { link: "#", text: "Poco", image: "/brand/poco.png" },
        { link: "#", text: "Vivo", image: "/brand/vivo.jpg" },
        { link: "#", text: "Iqoo", image: "/brand/Iqoo.jpg" },
        { link: "#", text: "Oppo", image: "/brand/oppo.jpg" },
        { link: "#", text: "Realme", image: "/brand/realme.jpg" },
        { link: "#", text: "Huawei", image: "/brand/Huawei.jpg" },
        { link: "#", text: "Honor", image: "/brand/Honor.jpg" },
        { link: "#", text: "Tecno", image: "/brand/Tecno.jpg" },
        { link: "#", text: "Infinix", image: "/brand/Infinix.jpg" },
        { link: "#", text: "Motorola", image: "/brand/Motorola.jpg" },
        { link: "#", text: "Pixel", image: "/brand/googlepixel.jpg" },
        { link: "#", text: "Red magic", image: "/brand/redmagic.jpg" },

    ];
    return(
        <>
            <div style={{ height: '600px', position: 'relative' }} className="mt-10">
                <FlowingMenu items={demoItems}
                    speed={15}
                    textColor="#ffffff"
                    bgColor="#060010"
                    marqueeBgColor="#ffffff"
                    marqueeTextColor="#060010"
                    borderColor="#ffffff"
                />
            </div>

        </>
    )
}