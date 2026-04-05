"use client"

export default function items() {
    return (
        <>


            <div className="grid grid-cols-3 grid-rows-1  mx-auto w-[80%] my-20">
                <div className="col-span-2 mx-auto ">
                    <img src="test1.png" alt="" className="md:h-150 h-[40vh]"/>
                </div>
                <div className="col-start-3 bg-red-300">6</div>
            </div>
        </>
    )
}