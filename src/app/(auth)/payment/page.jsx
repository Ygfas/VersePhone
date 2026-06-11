// app/payment/page.jsx
// Next.js 14+ App Router: useSearchParams() requires Suspense boundary

import { Suspense } from "react";
import PaymentPage from "./(Suspense)/PaymentPage"; // ← the client component

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-[#080808] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-zinc-500 text-sm">Memuat halaman pembayaran...</p>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <PaymentPage />
        </Suspense>
    );
}