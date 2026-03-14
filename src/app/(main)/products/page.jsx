import { IconTrolley } from "@tabler/icons-react"
import FloatingSearch from "@/components/ui/floating-search"
import FilterItems from "@/components/ui/filter-items"

export default function Products() {
    return (
        <>

            <div className="relative min-h-screen bg-gray-50 ">
                {/* Search bar diletakkan di luar div utama produk agar z-index terjaga */}
                <FloatingSearch />


                <div className="pt-10 pb-20 lg:px-20 bg-slate-100 dark:bg-slate-900">
                    <FilterItems />
                    <div className="columns-2 xl:columns-3 gap-6 space-y-6 mx-12 ">


                        <div
                            className="break-inside-avoid bg-white dark:bg-slate-800 border shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 py-12 ">

                            <figure className="relative w-full h-auto bg-gray-50 dark:bg-slate-800 flex justify-center p-2">
                                <img src="/test1.png" alt="Shoes" class="rounded-lg object-contain lg:max-h-140 max-h-30  " width="" />
                            </figure>


                            <div class="p-6">
                                <h1 class="flex justify-center mb-2 text-[4vw] lg:text-4xl  font-bold text-gray-800 dark:text-neutral-100 text-center">
                                    VIVO Y21
                                </h1>

                                <h2 class="text-[2vw] lg:text-2xl font-semibold leading-relaxed text-center text-gray-600 dark:text-neutral-400">
                                    Harga Jual
                                </h2>


                            </div>

                        </div>
                        <div
                            className="break-inside-avoid bg-white dark:bg-slate-800 border shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 py-12 ">

                            <figure className="relative w-full h-auto bg-gray-50 dark:bg-slate-800 flex justify-center p-2">
                                <img src="/test1.png" alt="Shoes" class="rounded-lg object-contain lg:max-h-140 max-h-30  " width="" />
                            </figure>


                            <div class="p-6">
                                <h1 class="flex justify-center mb-2 text-[4vw] lg:text-4xl  font-bold text-gray-800 dark:text-neutral-100 text-center">
                                    VIVO Y21
                                </h1>

                                <h2 class="text-[2vw] lg:text-2xl font-semibold leading-relaxed text-center text-gray-600 dark:text-neutral-400">
                                    Harga Jual
                                </h2>


                            </div>

                        </div>
                        <div
                            className="break-inside-avoid bg-white dark:bg-slate-800 border shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 py-12 ">

                            <figure className="relative w-full h-auto bg-gray-50 dark:bg-slate-800 flex justify-center p-2">
                                <img src="/test1.png" alt="Shoes" class="rounded-lg object-contain lg:max-h-140 max-h-30  " width="" />
                            </figure>


                            <div class="p-6">
                                <h1 class="flex justify-center mb-2 text-[4vw] lg:text-4xl  font-bold text-gray-800 dark:text-neutral-100 text-center">
                                    VIVO Y21
                                </h1>

                                <h2 class="text-[2vw] lg:text-2xl font-semibold leading-relaxed text-center text-gray-600 dark:text-neutral-400">
                                    Harga Jual
                                </h2>


                            </div>

                        </div>
                      
                      





                    </div>
                </div>
            </div>
        </>
    )
}