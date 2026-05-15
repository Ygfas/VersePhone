"use client";
import { useState } from "react";
// Impor data dan fungsi dari lib/products
import { products, formatPrice } from "@/lib/products";
import { ArrowLeft } from "lucide-react";

// Default shipping (Gratis)
const DEFAULT_SHIPPING = { id: "standard", label: "Standard Shipping", price: 0 };
const STEPS = ["Informasi", "Pembayaran"];

// Simulasi mengambil satu produk dari data Anda untuk ditampilkan di ringkasan
// Dalam aplikasi nyata, ini biasanya diambil dari State Management (Redux/Zustand) atau Context
const SELECTED_PRODUCT = products[0];
const QTY = 1;

// ─── Shared UI ─────────────────────────────────────────────────────────────
function StepBar({ current }) {
    return (
        <nav className="flex items-center gap-1.5 text-2xl mb-8">
            {STEPS.map((s, i) => (
                <span key={s} className="flex items-center gap-1.5">
                    <span className={i === current ? "text-white font-semibold" : i < current ? "text-zinc-400" : "text-zinc-600"}>
                        {s}
                    </span>
                    {i < STEPS.length - 1 && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-zinc-700">
                            <path d="M3 1.5l3.5 3.5L3 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </span>
            ))}
        </nav>
    );
}

function TInput({ error, icon, ...props }) {
    return (
        <div className="relative">
            <input {...props}
                className={`w-full bg-zinc-900/60 border ${error ? "border-red-500/70 focus:border-red-400" : "border-zinc-800 focus:border-zinc-600"} rounded-xl px-4 py-4 text-md text-white placeholder-zinc-600 transition-colors outline-none ${icon ? "pr-10" : ""}`}
            />
            {icon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>}
        </div>
    );
}

function TSelect({ error, children, ...props }) {
    return (
        <select {...props}
            className={`w-full bg-zinc-900 border ${error ? "border-red-500/70" : "border-zinc-800 focus:border-zinc-600"} rounded-xl px-4 py-4 text-md text-white transition-colors outline-none appearance-none cursor-pointer`}>
            {children}
        </select>
    );
}

function ErrMsg({ msg }) {
    return msg ? <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">{msg}</p> : null;
}

function SummaryRow({ label, value, onEdit }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-zinc-500 text-md shrink-0">{label}</span>
            <span className="text-zinc-300 text-md truncate flex-1">{value || "—"}</span>
            {onEdit && <button onClick={onEdit} className="text-blue-400 hover:text-blue-300 text-md shrink-0 transition-colors">Ubah</button>}
        </div>
    );
}

// ─── Step 1: Information ───────────────────────────────────────────────────
function StepInformation({ data, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const f = (key) => (e) => onChange(key, e.target.type === "checkbox" ? e.target.checked : e.target.value);

    const submit = () => {
        const e = {};
        if (!data.contact) e.contact = "Masukkan email atau nomor telepon";
        if (!data.lastName) e.lastName = "Masukkan nama belakang";
        if (!data.address) e.address = "Masukkan alamat";
        if (!data.city) e.city = "Masukkan kota";
        if (!data.state) e.state = "Pilih provinsi";
        setErrors(e);
        if (!Object.keys(e).length) onNext();
    };

    return (
        <div>
            <section className="mb-8">
                <h2 className="text-[16px] font-semibold mb-4">Kontak</h2>
                <TInput type="text" placeholder="Email atau nomor ponsel" value={data.contact} onChange={f("contact")} error={errors.contact} />
                <ErrMsg msg={errors.contact} />
            </section>

            <section className="mb-8">
                <h2 className="text-[16px] font-semibold mb-4">Alamat pengiriman</h2>
                <div className="space-y-3">
                    <TSelect value={data.country} onChange={f("country")}>
                        <option>Indonesia</option>
                    </TSelect>
                    <div className="grid grid-cols-2 gap-3">
                        <TInput type="text" placeholder="Nama depan" value={data.firstName} onChange={f("firstName")} />
                        <div>
                            <TInput type="text" placeholder="Nama belakang" value={data.lastName} onChange={f("lastName")} error={errors.lastName} />
                            <ErrMsg msg={errors.lastName} />
                        </div>
                    </div>
                    <div>
                        <TInput type="text" placeholder="Alamat lengkap" value={data.address} onChange={f("address")} error={errors.address} />
                        <ErrMsg msg={errors.address} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <TInput type="text" placeholder="Kota" value={data.city} onChange={f("city")} error={errors.city} />
                            <ErrMsg msg={errors.city} />
                        </div>
                        <div>
                            <TSelect value={data.state} onChange={f("state")} error={errors.state}>
                                <option value="">Provinsi</option>
                                {["DKI Jakarta", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Yogyakarta", "Banten"].map(s => <option key={s} value={s}>{s}</option>)}
                            </TSelect>
                            <ErrMsg msg={errors.state} />
                        </div>
                    </div>
                </div>
            </section>

            <button onClick={submit} className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all">
                Lanjut ke Pembayaran
            </button>
        </div>
    );
}

// ─── Step 2: Payment ───────────────────────────────────────────────────────
function StepPayment({ info, onBack, onComplete }) {
    const [method, setMethod] = useState("card");
    const [card, setCard] = useState({ num: "", expiry: "", cvv: "", name: "" });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const subtotal = SELECTED_PRODUCT.price * QTY;
    const total = subtotal + DEFAULT_SHIPPING.price;

    const fmtCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const fmtExp = v => { const n = v.replace(/\D/g, "").slice(0, 4); return n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };

    const submit = async () => {
        const e = {};
        if (method === "card") {
            if (card.num.replace(/\s/g, "").length < 16) e.num = "Nomor kartu tidak valid";
            if (!card.name) e.name = "Nama harus diisi";
            if (card.expiry.length < 5) e.expiry = "Format MM/YY";
            if (card.cvv.length < 3) e.cvv = "CVV tidak valid";
        }
        setErrors(e);
        if (Object.keys(e).length) return;
        setProcessing(true);
        await new Promise(r => setTimeout(r, 2000));
        onComplete();
    };

    return (
        <div>
            <div className="mb-8 rounded-xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
                <SummaryRow label="Kontak" value={info.contact} onEdit={() => onBack()} />
                <SummaryRow label="Alamat" value={`${info.address}, ${info.city}`} onEdit={() => onBack()} />
            </div>

            <section className="mb-6">
                <h2 className="text-[16px] font-semibold mb-4">Metode Pembayaran</h2>
                <div className="flex gap-2 mb-4">
                    {[["card", "💳 Kartu"], ["qris", "📱 QRIS"]].map(([id, label]) => (
                        <button key={id} onClick={() => setMethod(id)}
                            className={`px-4 py-2 text-md font-medium rounded-lg border transition-all ${method === id ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-800 text-zinc-500"}`}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/20">
                    {method === "card" ? (
                        <div className="space-y-3">
                            <TInput placeholder="Nomor Kartu" value={card.num} onChange={e => setCard({ ...card, num: fmtCard(e.target.value) })} error={errors.num} />
                            <TInput placeholder="Nama di Kartu" value={card.name} onChange={e => setCard({ ...card, name: e.target.value })} error={errors.name} />
                            <div className="grid grid-cols-2 gap-3">
                                <TInput placeholder="MM / YY" value={card.expiry} onChange={e => setCard({ ...card, expiry: fmtExp(e.target.value) })} error={errors.expiry} />
                                <TInput placeholder="CVV" value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} error={errors.cvv} />
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <div className="mx-auto w-24 h-24 bg-white p-2 rounded-lg mb-2">
                                <div className="w-full h-full bg-zinc-900" />
                            </div>
                            <p className="text-lg text-zinc-500">Scan QRIS untuk membayar</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="flex gap-0 items-center ">
                <button onClick={onBack} className="flex-1 py-3.5 bg-amber-400 text-white text-sm font-semibold rounded-l-xl">Kembali</button>
                <button onClick={submit} disabled={processing} className="flex-1 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-r-xl">
                    {processing ? "Memproses..." : `Bayar Sekarang · ${formatPrice(total)}`}
                </button>
            </div>
        </div>
    );
}

// ─── Sidebar Summary (Data Terintegrasi) ───────────────────────────────────
function OrderSummary() {
    // Menggunakan data dari SELECTED_PRODUCT (Vivo Y21)
    const subtotal = SELECTED_PRODUCT.price * QTY;

    return (
        <div className="sticky top-10 space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden flex items-center justify-center">
                        <img
                            src={SELECTED_PRODUCT.image}
                            alt={SELECTED_PRODUCT.title}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-zinc-700 text-white text-[10px] flex items-center justify-center rounded-full border border-black">
                        {QTY}
                    </span>
                </div>
                <div className="flex-1">
                    <p className="text-white text-lg font-medium">{SELECTED_PRODUCT.title}</p>
                    <p className="text-zinc-500 text-md">{SELECTED_PRODUCT.brand} • {SELECTED_PRODUCT.storage[0]}</p>
                </div>
                <p className=" text-white font-medium text-md">{formatPrice(subtotal)}</p>
            </div>

            <div className="border-t border-zinc-900 pt-4 space-y-3 text-md">
                <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                    <span>Pengiriman</span>
                    <span className="text-emerald-400">Gratis</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-white border-t border-zinc-900 pt-3 mt-1">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [info, setInfo] = useState({ contact: "", firstName: "", lastName: "", address: "", city: "", state: "", country: "Indonesia" });

    if (done) return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-4">✅</div>
                <h1 className="text-2xl font-bold mb-2">Terima Kasih!</h1>
                <p className="text-zinc-500 mb-6">Pesanan Anda untuk {SELECTED_PRODUCT.title} telah kami terima.</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white text-black rounded-lg font-bold">Kembali ke Toko</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white">
            <div className="max-w-[1000px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 py-12">
                <div>
                    <div className="mb-8 flex items-center gap-2 text-2xl font-bold">
                        <div className="w-6 h-6 bg-blue-600 rotate-45 rounded-sm" /> VersePhone
                    </div>

                    <StepBar current={step} />

                    {step === 0 ? (
                        <StepInformation data={info} onChange={(k, v) => setInfo({ ...info, [k]: v })} onNext={() => setStep(1)} />
                    ) : (
                        <StepPayment info={info} onBack={() => setStep(0)} onComplete={() => setDone(true)} />
                    )}
                </div>

                <div className="hidden lg:block border-l border-zinc-900 pl-12">
                    <h2 className="text-2xl font-semibold mb-8 mt-17">Ringkasan Pesanan</h2>
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
}