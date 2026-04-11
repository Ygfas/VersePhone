"use client";
import { useState } from "react";

// ─── Dummy Products (VersePhone Store) ──────────────────────────────────────
const CART = [
    { id: 1, name: "Acme Cup", variant: "Black", price: 15.0, qty: 2, emoji: "☕" },
    { id: 2, name: "Acme Hoodie", variant: "Natural", price: 50.0, qty: 1, emoji: "👕" },
];

const SHIPPING_OPTIONS = [
    { id: "standard", label: "Standard Shipping", desc: "5–7 business days", price: 0 },
    { id: "express", label: "Express Shipping", desc: "2–3 business days", price: 12 },
    { id: "overnight", label: "Overnight Shipping", desc: "Next business day", price: 25 },
];

const STEPS = ["Informasi", "Pengiriman", "Pembayaran"];

// ─── Shared UI ─────────────────────────────────────────────────────────────
function StepBar({ current }) {
    return (
        <nav className="flex items-center gap-1.5 text-xs mb-8">
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
                className={`w-full bg-zinc-900/60 border ${error ? "border-red-500/70 focus:border-red-400" : "border-zinc-800 focus:border-zinc-600"} rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 transition-colors outline-none ${icon ? "pr-10" : ""}`}
            />
            {icon && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600">{icon}</span>}
        </div>
    );
}

function TSelect({ error, children, ...props }) {
    return (
        <select {...props}
            className={`w-full bg-zinc-900 border ${error ? "border-red-500/70" : "border-zinc-800 focus:border-zinc-600"} rounded-xl px-4 py-3 text-sm text-white transition-colors outline-none appearance-none cursor-pointer`}>
            {children}
        </select>
    );
}

function ErrMsg({ msg }) {
    return msg ? <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1">⚠ {msg}</p> : null;
}

function Checkbox({ checked, onChange, children }) {
    return (
        <label className="flex items-center gap-2.5 text-sm text-zinc-500 cursor-pointer select-none group">
            <span onClick={onChange}
                className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? "bg-white border-white" : "border-zinc-700 group-hover:border-zinc-500"}`}>
                {checked && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </span>
            {children}
        </label>
    );
}

function SummaryRow({ label, value, onEdit }) {
    return (
        <div className="flex items-center justify-between px-4 py-3 gap-3">
            <span className="text-zinc-500 text-xs shrink-0">{label}</span>
            <span className="text-zinc-300 text-xs truncate flex-1">{value || "—"}</span>
            {onEdit && <button onClick={onEdit} className="text-blue-400 hover:text-blue-300 text-xs shrink-0 transition-colors">Change</button>}
        </div>
    );
}

// ─── Step 1: Information ───────────────────────────────────────────────────
function StepInformation({ data, onChange, onNext }) {
    const [errors, setErrors] = useState({});
    const f = (key) => (e) => onChange(key, e.target.type === "checkbox" ? e.target.checked : e.target.value);

    const submit = () => {
        const e = {};
        if (!data.contact) e.contact = "Enter an email or phone number";
        if (!data.lastName) e.lastName = "Enter a last name";
        if (!data.address) e.address = "Enter an address";
        if (!data.city) e.city = "Enter a city";
        if (!data.state) e.state = "Select a state / province";
        setErrors(e);
        if (!Object.keys(e).length) onNext();
    };

    return (
        <div>
            <section className="mb-8">
                <h2 className="text-[15px] font-semibold mb-4">Kontak</h2>
                <TInput type="text" placeholder="Email atau nomor ponsel" value={data.contact} onChange={f("contact")} error={errors.contact} />
                <ErrMsg msg={errors.contact} />
            </section>

            <section className="mb-8">
                <h2 className="text-[15px] font-semibold mb-4">Alamat pengiriman</h2>
                <div className="space-y-3">
                    <TSelect value={data.country} onChange={f("country")}>
                        {["Indonesia"].map(c => <option key={c}>{c}</option>)}
                    </TSelect>
                    <div className="grid grid-cols-2 gap-3">
                        <TInput type="text" placeholder="Nama depan" value={data.firstName} onChange={f("firstName")} />
                        <div>
                            <TInput type="text" placeholder="Nama belakang" value={data.lastName} onChange={f("lastName")} error={errors.lastName} />
                            <ErrMsg msg={errors.lastName} />
                        </div>
                    </div>
                    <div>
                        <TInput type="text" placeholder="Alamat" value={data.address} onChange={f("address")} error={errors.address}
                            icon={<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.4" /><path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>}
                        />
                        <ErrMsg msg={errors.address} />
                    </div>
                    <TInput type="text" placeholder="Gedung, Penginapan, dll. (opsional)" value={data.apartment} onChange={f("apartment")} />
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <TInput type="text" placeholder="Kota" value={data.city} onChange={f("city")} error={errors.city} />
                            <ErrMsg msg={errors.city} />
                        </div>
                        <div>
                            <TSelect value={data.state} onChange={f("state")} error={errors.state}>
                                <option value="">Provinsi</option>
                                {["DKI Jakarta", "Jawa Barat", "Jawa Timur", "Jawa Tengah", "Yogyakarta", "Banten"].map(s => <option key={s}>{s}</option>)}
                            </TSelect>
                            <ErrMsg msg={errors.state} />
                        </div>
                    </div>
                    <Checkbox checked={data.saveInfo} onChange={() => onChange("saveInfo", !data.saveInfo)}>
                        Simpan informasi ini untuk lain kali.
                    </Checkbox>
                </div>
            </section>

            <button onClick={submit} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all">
                Lanjut untuk Pengiriman →
            </button>
        </div>
    );
}

// ─── Step 2: Shipping ──────────────────────────────────────────────────────
function StepShipping({ data, shippingId, onSelect, onBack, onNext }) {
    return (
        <div>
            <div className="mb-8 rounded-xl border border-zinc-800 divide-y divide-zinc-800 overflow-hidden">
                <SummaryRow label="Kontak" value={data.contact} onEdit={onBack} />
                <SummaryRow label="Kirim ke" value={[data.address, data.city, data.state, data.country].filter(Boolean).join(", ")} onEdit={onBack} />
            </div>

            <section className="mb-8">
                <h2 className="text-[15px] font-semibold mb-4">Metode pengiriman</h2>
                <div className="space-y-2.5">
                    {SHIPPING_OPTIONS.map(opt => (
                        <label key={opt.id}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border cursor-pointer transition-all ${shippingId === opt.id ? "border-zinc-600 bg-zinc-800/50" : "border-zinc-800 hover:border-zinc-700"}`}>
                            <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${shippingId === opt.id ? "border-white" : "border-zinc-600"}`}>
                                {shippingId === opt.id && <span className="w-2 h-2 rounded-full bg-white" />}
                            </span>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-white">{opt.label}</p>
                                <p className="text-xs text-zinc-500">{opt.desc}</p>
                            </div>
                            <span className="text-sm font-medium">{opt.price === 0 ? <span className="text-emerald-400">Free</span> : `$${opt.price.toFixed(2)}`}</span>
                            <input type="radio" className="hidden" checked={shippingId === opt.id} onChange={() => onSelect(opt.id)} />
                        </label>
                    ))}
                </div>
            </section>

            <div className="flex gap-3 items-center">
                <button onClick={onBack} className="px-4 py-3.5 text-zinc-400 hover:text-white text-sm transition-colors">← Kembali</button>
                <button onClick={onNext} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all">
                    Lanjut untuk Pembayaran →
                </button>
            </div>
        </div>
    );
}

// ─── Step 3: Payment ───────────────────────────────────────────────────────
function StepPayment({ info, shippingId, onBack, onComplete }) {
    const [method, setMethod] = useState("card");
    const [card, setCard] = useState({ num: "", expiry: "", cvv: "", name: "", billingSame: true });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const shippingOpt = SHIPPING_OPTIONS.find(s => s.id === shippingId) || SHIPPING_OPTIONS[0];
    const subtotal = CART.reduce((s, p) => s + p.price * p.qty, 0);
    const total = subtotal + shippingOpt.price;

    const fmtCard = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const fmtExp = v => { const n = v.replace(/\D/g, "").slice(0, 4); return n.length > 2 ? n.slice(0, 2) + "/" + n.slice(2) : n; };
    const c = (key) => (e) => setCard(prev => ({ ...prev, [key]: e.target.value }));

    const submit = async () => {
        const e = {};
        if (method === "card") {
            if (card.num.replace(/\s/g, "").length < 16) e.num = "Enter a valid card number";
            if (!card.name) e.name = "Enter cardholder name";
            if (card.expiry.length < 5) e.expiry = "Enter expiry (MM/YY)";
            if (card.cvv.length < 3) e.cvv = "Enter CVV";
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
                <SummaryRow label="Kontak" value={info.contact} onEdit={() => onBack(0)} />
                <SummaryRow label="Kirim ke" value={[info.address, info.city, info.state].filter(Boolean).join(", ")} onEdit={() => onBack(1)} />
                <SummaryRow label="Metode" value={`${shippingOpt.label} · ${shippingOpt.price === 0 ? "Free" : "$" + shippingOpt.price}`} onEdit={() => onBack(1)} />
            </div>

            <section className="mb-6">
                <h2 className="text-[15px] font-semibold mb-1.5">Pembayarn</h2>
                <p className="text-xs text-zinc-600 mb-4">Semau pembayaran terlindungi dan terenkripsi.</p>

                <div className="flex gap-2 mb-4 flex-wrap">
                    {[["card", "💳 Credit card"], ["paypal", "🅿 PayPal"], ["qris", "📱 QRIS"]].map(([id, label]) => (
                        <button key={id} onClick={() => setMethod(id)}
                            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${method === id ? "border-zinc-500 bg-zinc-800 text-white" : "border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"}`}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="rounded-xl border border-zinc-800 overflow-hidden">
                    {method === "card" && (
                        <div className="p-4 space-y-3">
                            <div>
                                <TInput type="text" placeholder="Card number" value={card.num}
                                    onChange={e => setCard(p => ({ ...p, num: fmtCard(e.target.value) }))} error={errors.num}
                                    icon={<svg width="20" height="14" viewBox="0 0 20 14" fill="none"><rect x="0.5" y="0.5" width="19" height="13" rx="2" stroke="#374151" /><rect y="3.5" width="20" height="3" fill="#1f2937" /><rect x="3" y="9" width="6" height="1.5" rx="0.75" fill="#374151" /></svg>}
                                />
                                <ErrMsg msg={errors.num} />
                            </div>
                            <div>
                                <TInput type="text" placeholder="Name on card" value={card.name} onChange={c("name")} error={errors.name} />
                                <ErrMsg msg={errors.name} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <TInput type="text" placeholder="MM / YY" value={card.expiry}
                                        onChange={e => setCard(p => ({ ...p, expiry: fmtExp(e.target.value) }))} error={errors.expiry} />
                                    <ErrMsg msg={errors.expiry} />
                                </div>
                                <div>
                                    <TInput type="text" placeholder="CVV" value={card.cvv}
                                        onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))} error={errors.cvv}
                                        icon={<svg width="16" height="12" viewBox="0 0 16 12" fill="none"><rect x="0.5" y="0.5" width="15" height="11" rx="1.5" stroke="#374151" /><circle cx="11" cy="6" r="2.5" stroke="#374151" /></svg>}
                                    />
                                    <ErrMsg msg={errors.cvv} />
                                </div>
                            </div>
                        </div>
                    )}
                    {method === "paypal" && (
                        <div className="p-10 text-center">
                            <div className="text-4xl mb-3">🅿</div>
                            <p className="text-zinc-500 text-sm">You'll be redirected to PayPal to complete your payment.</p>
                        </div>
                    )}
                    {method === "qris" && (
                        <div className="p-8 text-center">
                            <p className="text-zinc-400 text-sm mb-4">Scan with GoPay, OVO, Dana, ShopeePay, or any QRIS app</p>
                            <div className="mx-auto w-28 h-28 bg-white rounded-2xl flex items-center justify-center p-2">
                                <div className="w-full h-full grid grid-cols-5 gap-px">
                                    {Array.from({ length: 25 }, (_, i) => (
                                        <div key={i} className={`rounded-sm ${[0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24, 7, 12, 17].includes(i) ? "bg-zinc-900" : "bg-white"}`} />
                                    ))}
                                </div>
                            </div>
                            <p className="text-zinc-600 text-xs mt-3">Expires in 15:00</p>
                        </div>
                    )}
                </div>
            </section>

            {method === "card" && (
                <section className="mb-8">
                    <h2 className="text-[15px] font-semibold mb-3">Billing address</h2>
                    <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800">
                        {[
                            { id: true, label: "Same as shipping address" },
                            { id: false, label: "Use a different billing address" },
                        ].map(opt => (
                            <label key={String(opt.id)}
                                className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${card.billingSame === opt.id ? "bg-zinc-800/40" : "hover:bg-zinc-900/30"}`}>
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${card.billingSame === opt.id ? "border-white" : "border-zinc-600"}`}>
                                    {card.billingSame === opt.id && <span className="w-2 h-2 rounded-full bg-white" />}
                                </span>
                                <span className="text-sm text-zinc-300">{opt.label}</span>
                                <input type="radio" className="hidden" checked={card.billingSame === opt.id} onChange={() => setCard(p => ({ ...p, billingSame: opt.id }))} />
                            </label>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex gap-3 items-center">
                <button onClick={() => onBack(1)} className="px-4 py-3.5 text-zinc-400 hover:text-white text-sm transition-colors">← Kembali</button>
                <button onClick={submit} disabled={processing}
                    className="flex-1 sm:flex-none sm:px-10 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 active:scale-[0.98] text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2">
                    {processing
                        ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" /></svg> Processing…</>
                        : <>🔒 Bayar Sekarang · ${total.toFixed(2)}</>
                    }
                </button>
            </div>
        </div>
    );
}

// ─── Order Summary Sidebar ─────────────────────────────────────────────────
function OrderSummary({ shippingId }) {
    const shippingOpt = SHIPPING_OPTIONS.find(s => s.id === shippingId);
    const subtotal = CART.reduce((s, p) => s + p.price * p.qty, 0);
    const shippingCost = shippingOpt ? shippingOpt.price : 0;
    const total = subtotal + shippingCost;

    return (
        <div className="sticky top-10 space-y-5">
            <div className="space-y-4">
                {CART.map(p => (
                    <div key={p.id} className="flex items-center gap-3.5">
                        <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 rounded-xl border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-2xl">{p.emoji}</div>
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-600 text-white text-[10px] font-bold flex items-center justify-center">{p.qty}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white">{p.name}</p>
                            <p className="text-xs text-zinc-500">{p.variant}</p>
                        </div>
                        <p className="text-sm font-medium text-white">${(p.price * p.qty).toFixed(2)}</p>
                    </div>
                ))}
            </div>

            <div className="border-t border-zinc-900" />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span className="text-white">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span>{shippingOpt ? (shippingOpt.price === 0 ? <span className="text-emerald-400">Free</span> : `$${shippingOpt.price.toFixed(2)}`) : <span className="text-zinc-600 text-xs">Calculated at next step</span>}</span>
                </div>
            </div>

            <div className="border-t border-zinc-900" />

            <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-white">Total</span>
                <div><span className="text-xs text-zinc-600 mr-1">USD</span><span className="text-2xl font-bold text-white">${total.toFixed(2)}</span></div>
            </div>
        </div>
    );
}

// ─── Success Screen ────────────────────────────────────────────────────────
function SuccessScreen({ info, onReset }) {
    const orderNum = Math.random().toString(36).slice(2, 10).toUpperCase();
    return (
        <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center px-4">
            <div className="text-center max-w-sm w-full">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800/60 flex items-center justify-center mx-auto mb-6 text-2xl text-emerald-400">✓</div>
                <p className="text-xs text-zinc-600 uppercase tracking-widest mb-2">Order #{orderNum}</p>
                <h1 className="text-2xl font-bold tracking-tight mb-3">Thank you{info.firstName ? `, ${info.firstName}` : ""}!</h1>
                <p className="text-zinc-500 text-sm mb-6">
                    Your order is confirmed. Shipping confirmation will be sent to{" "}
                    <span className="text-zinc-300">{info.contact}</span>.
                </p>
                <div className="rounded-xl border border-zinc-800 overflow-hidden mb-8 text-left">
                    {CART.map(p => (
                        <div key={p.id} className="flex items-center gap-3 px-4 py-3 border-b border-zinc-900 last:border-0">
                            <span className="text-xl">{p.emoji}</span>
                            <div className="flex-1">
                                <p className="text-sm text-white">{p.name}</p>
                                <p className="text-xs text-zinc-600">{p.variant} × {p.qty}</p>
                            </div>
                            <span className="text-sm text-white">${(p.price * p.qty).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="px-4 py-3 bg-zinc-900/30 flex justify-between">
                        <span className="text-sm text-zinc-400">Total paid</span>
                        <span className="text-sm font-semibold text-white">${CART.reduce((s, p) => s + p.price * p.qty, 0).toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={onReset} className="px-8 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
                    Lanjut Belanja
                </button>
            </div>
        </div>
    );
}

// ─── Root ──────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
    const [step, setStep] = useState(0);
    const [done, setDone] = useState(false);
    const [info, setInfo] = useState({
        contact: "", newsletter: false, country: "Indonesia",
        firstName: "", lastName: "", address: "", apartment: "",
        city: "", state: "", zip: "", saveInfo: false,
    });
    const [shippingId, setShippingId] = useState("standard");

    const updateInfo = (key, val) => setInfo(prev => ({ ...prev, [key]: val }));

    if (done) return <SuccessScreen info={info} onReset={() => { setDone(false); setStep(0); }} />;

    return (
        <div className="min-h-screen bg-[#0b0b0b] text-white ">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=Syne:wght@600;700;800&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .syne { font-family: 'Syne', sans-serif; }
        select option { background: #111; color: #fff; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>

            <div className="max-w-[1080px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_360px] min-h-screen">

                <div className="py-10 pt-30 lg:pr-12 lg:border-r border-zinc-900">
                    <div className="mb-10">
                        <span className="syne text-xl font-bold tracking-tight flex items-center gap-2">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 1L23 21H1L12 1Z" fill="white" fillOpacity="0.95" />
                            </svg>
                            VersePhone
                        </span>
                    </div>

                    <StepBar current={step} />

                    {step === 0 && (
                        <StepInformation data={info} onChange={updateInfo} onNext={() => setStep(1)} />
                    )}
                    {step === 1 && (
                        <StepShipping data={info} shippingId={shippingId} onSelect={setShippingId}
                            onBack={() => setStep(0)} onNext={() => setStep(2)} />
                    )}
                    {step === 2 && (
                        <StepPayment info={info} shippingId={shippingId}
                            onBack={(s) => setStep(s ?? 1)} onComplete={() => setDone(true)} />
                    )}
                </div>

                <div className="hidden lg:block py-10 pt-62 pl-10">
                    <h1 className="text-2xl mb-10 ">
                        Total Pembayaran
                    </h1>
                    <OrderSummary shippingId={shippingId} />
                </div>
            </div>
        </div>
    );
}