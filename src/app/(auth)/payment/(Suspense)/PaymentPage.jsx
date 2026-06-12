"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiUser,
    FiPhone,
    FiMapPin,
    FiArrowRight,
    FiCheck,
    FiAlertCircle,
    FiLock,
    FiZap,
    FiShield
} from "react-icons/fi";
import { Smartphone } from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(num) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(num);
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = ["Informasi", "Pembayaran", "Bukti Transfer"];

function StepBar({ current }) {
    return (
        <div className="flex items-center gap-0 mb-10 w-full backdrop-blur-sm bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800/40">
            {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-2">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${i < current
                                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                    : i === current
                                        ? "bg-blue-600 text-white ring-4 ring-blue-600/20 shadow-lg shadow-blue-600/20"
                                        : "bg-zinc-800 text-zinc-500 border border-zinc-700/50"
                                }`}
                        >
                            {i < current ? <FiCheck className="w-4 h-4 stroke-[3]" /> : i + 1}
                        </div>
                        <span
                            className={`text-[11px] font-bold tracking-wide uppercase transition-colors duration-300 ${i === current
                                    ? "text-blue-400"
                                    : i < current
                                        ? "text-emerald-400"
                                        : "text-zinc-500"
                                }`}
                        >
                            {s}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div
                            className={`flex-1 h-[2px] mx-4 mb-6 transition-all duration-700 rounded-full ${i < current ? "bg-emerald-500 shadow-sm shadow-emerald-500" : "bg-zinc-800"
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

// ─── Shared Input Components ──────────────────────────────────────────────────
function Field({ label, icon: Icon, error, children }) {
    return (
        <div className="space-y-2 w-full">
            <label className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                {Icon && <Icon className="w-3.5 h-3.5 text-zinc-500" />}
                {label}
            </label>
            <div className="relative">
                {children}
            </div>
            <AnimatePresence mode="wait">
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="text-red-400 text-xs flex items-center gap-1.5 mt-1 font-medium"
                    >
                        <FiAlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

function TInput({ error, ...props }) {
    return (
        <input
            {...props}
            className={`w-full bg-zinc-900/80 backdrop-blur-sm border ${error ? "border-red-500/50 focus:border-red-500" : "border-zinc-800 focus:border-blue-500/80"
                } rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-all outline-none focus:ring-4 ${error ? "focus:ring-red-500/10" : "focus:ring-blue-500/10"
                }`}
        />
    );
}

// ─── Product Summary Sidebar ──────────────────────────────────────────────────
function ProductSidebar({ product, selectedColor, selectedStorage }) {
    if (!product) {
        return (
            <div className="animate-pulse space-y-5 bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 max-w-sm mx-auto">
                {/* Skeleton Image Full Width */}
                <div className="w-full h-48 bg-zinc-800 rounded-xl" />
                <div className="space-y-3">
                    <div className="h-3 bg-zinc-800 rounded w-1/4" />
                    <div className="h-5 bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-800 rounded w-1/2" />
                </div>
                <div className="h-px bg-zinc-800 my-4" />
                <div className="space-y-3">
                    <div className="h-4 bg-zinc-800 rounded w-full" />
                    <div className="h-4 bg-zinc-800 rounded w-full" />
                    <div className="h-6 bg-zinc-800 rounded w-2/3 mt-2" />
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-8 space-y-4 w-full max-w-sm mx-auto"
        >
            {/* Main Card Container */}
            <div className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">

                {/* 1. TOP SECTION: Gambar Produk Full-Width */}
                <div className="w-full h-52 bg-gradient-to-b from-zinc-800/30 to-zinc-900/90 border-b border-zinc-800/60 flex items-center justify-center p-6 relative group overflow-hidden">
                    {/* Efek Ambient Glow di belakang gambar */}
                    <div className="absolute w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/20 transition-colors duration-500" />

                    {product.image ? (
                        <img
                            src={
                                product.image.startsWith("data:")
                                    ? product.image
                                    : `/api/image/${product.image}`
                            }
                            alt={product.title}
                            className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Smartphone className="w-12 h-12 text-zinc-600" />
                            <span className="text-xs text-zinc-500">No Image Available</span>
                        </div>
                    )}
                </div>

                {/* 2. BODY SECTION: Detail Produk */}
                <div className="p-6 space-y-5">
                    {/* Informasi Utama */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                            {product.brand}
                        </p>
                        <h3 className="text-white font-black text-xl leading-tight tracking-tight break-words">
                            {product.title}
                        </h3>

                        {/* Badges Pilihan Variasi */}
                        {(selectedColor || selectedStorage) && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {selectedColor && (
                                    <span className="bg-zinc-800/80 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-zinc-700/40 tracking-wide shadow-sm">
                                        {selectedColor}
                                    </span>
                                )}
                                {selectedStorage && (
                                    <span className="bg-zinc-800/80 text-zinc-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-zinc-700/40 tracking-wide shadow-sm">
                                        {selectedStorage}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Rincian Harga & Total */}
                    <div className="space-y-3 border-t border-zinc-800/60 pt-4 text-sm">
                        <div className="flex justify-between text-zinc-400 font-medium">
                            <span>Harga</span>
                            <span className="text-zinc-200 font-semibold">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                        <div className="flex justify-between text-zinc-400 font-medium">
                            <span>Pengiriman</span>
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-md text-xs border border-emerald-500/10">
                                Gratis
                            </span>
                        </div>
                        <div className="flex justify-between items-baseline text-xl font-black text-white border-t border-zinc-800/80 pt-4 mt-2">
                            <span className="text-sm font-bold text-zinc-300">Total Pembayaran</span>
                            <span className="text-blue-500 tracking-tight text-2xl">
                                {formatPrice(product.price)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. FOOTER SECTION: Trust Badges */}
            <div className="grid grid-cols-3 gap-2.5">
                {[
                    { icon: FiLock, label: "Aman", color: "text-blue-400 bg-blue-500/5 border-blue-500/10" },
                    { icon: FiZap, label: "Cepat", color: "text-amber-400 bg-amber-500/5 border-amber-500/10" },
                    { icon: FiShield, label: "Terjamin", color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10" },
                ].map((b, idx) => (
                    <div
                        key={idx}
                        className={`bg-zinc-900/40 border rounded-xl py-3 px-2 text-center flex flex-col items-center justify-center gap-1 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-zinc-700/50 ${b.color}`}
                    >
                        <b.icon className="w-4.5 h-4.5 stroke-[2.5]" />
                        <span className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase">
                            {b.label}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
// ─── STEP 1: Informasi ────────────────────────────────────────────────────────
function StepInformasi({ data, onChange, onNext }) {
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!data.first_name?.trim()) e.first_name = "Nama depan wajib diisi";
        if (!data.user_name?.trim()) e.user_name = "Nama belakang wajib diisi";
        if (!data.no_tlp_or_email?.trim())
            e.no_tlp_or_email = "No. HP atau email wajib diisi";
        if (!data.alamat?.trim()) e.alamat = "Alamat lengkap wajib diisi";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleNext = () => {
        if (validate()) onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-6 w-full"
        >
            <div className="border-b border-zinc-800/60 pb-4">
                <h2 className="text-2xl font-black text-white tracking-tight mb-1.5">
                    Informasi Pengiriman
                </h2>
                <p className="text-zinc-400 text-sm">
                    Isi data diri Anda dengan lengkap untuk memastikan kelancaran pengiriman barang.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nama Depan" icon={FiUser} error={errors.first_name}>
                    <TInput
                        placeholder="John"
                        value={data.first_name}
                        onChange={(e) => onChange("first_name", e.target.value)}
                        error={errors.first_name}
                    />
                </Field>
                <Field label="Nama Belakang" icon={FiUser} error={errors.user_name}>
                    <TInput
                        placeholder="Doe"
                        value={data.user_name}
                        onChange={(e) => onChange("user_name", e.target.value)}
                        error={errors.user_name}
                    />
                </Field>
            </div>

            <Field label="No. HP atau Email" icon={FiPhone} error={errors.no_tlp_or_email}>
                <TInput
                    placeholder="08xx atau email@contoh.com"
                    value={data.no_tlp_or_email}
                    onChange={(e) => onChange("no_tlp_or_email", e.target.value)}
                    error={errors.no_tlp_or_email}
                />
            </Field>

            <Field label="Alamat Lengkap" icon={FiMapPin} error={errors.alamat}>
                <textarea
                    placeholder="Nama jalan, Gedung, No. Rumah, RT/RW, Kecamatan, Kota/Kabupaten, Provinsi, Kode Pos"
                    value={data.alamat}
                    onChange={(e) => onChange("alamat", e.target.value)}
                    rows={4}
                    className={`w-full bg-zinc-900/80 backdrop-blur-sm border ${errors.alamat
                            ? "border-red-500/50 focus:border-red-500"
                            : "border-zinc-800 focus:border-blue-500/80"
                        } rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 transition-all outline-none resize-none focus:ring-4 ${errors.alamat ? "focus:ring-red-500/10" : "focus:ring-blue-500/10"
                        }`}
                />
            </Field>

            <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleNext}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all text-sm shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-4"
            >
                <span>Lanjut ke Pembayaran</span>
                <FiArrowRight className="w-4 h-4 stroke-[2.5]" />
            </motion.button>
        </motion.div>
    );
}

// ─── MAIN LAYOUT WRAPPER ─────────────────────────────────────────────────────
// Wrapper kontainer utama untuk merender kedua kolom (60% Kiri : 40% Kanan)
 export function CheckoutLayout({ currentStep, product, selectedColor, selectedStorage, checkoutData, setCheckoutData, handleNextStep }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-12 items-start">

                {/* SISI KIRI: 60% Lebar (6 dari 10 Kolom Grid) */}
                <div className="lg:col-span-6 w-full space-y-6">
                    <StepBar current={currentStep} />

                    <div className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <StepInformasi
                                    data={checkoutData}
                                    onChange={(field, val) => setCheckoutData(prev => ({ ...prev, [field]: val }))}
                                    onNext={handleNextStep}
                                />
                            )}
                            {/* Render step lanjutan Anda di sini menggunakan logika yang sama */}
                        </AnimatePresence>
                    </div>
                </div>

                {/* SISI KANAN: 40% Lebar (4 dari 10 Kolom Grid) */}
                <div className="lg:col-span-4 w-full">
                    <ProductSidebar
                        product={product}
                        selectedColor={selectedColor}
                        selectedStorage={selectedStorage}
                    />
                </div>

            </div>
        </div>
    );
}
// ─── STEP 2: Pembayaran QRIS ──────────────────────────────────────────────────
function StepQRIS({ info, product, onBack, onNext }) {
    const [confirmed, setConfirmed] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6 max-w-md mx-auto"
        >
            {/* Header Section */}
            <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                    Scan & Bayar
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Scan QR code di bawah menggunakan aplikasi dompet digital atau mobile banking kamu.
                </p>
            </div>

            {/* Konfirmasi Data Pengiriman */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                <div className="px-4 py-3 bg-zinc-800/40 border-b border-zinc-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Informasi Pengiriman
                    </p>
                </div>
                <div className="divide-y divide-zinc-800/60 text-sm">
                    {[
                        {
                            label: "Nama",
                            value: `${info.first_name} ${info.user_name}`,
                        },
                        { label: "Kontak", value: info.no_tlp_or_email },
                        { label: "Alamat", value: info.alamat },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex gap-4 px-4 py-3.5 items-start hover:bg-zinc-800/20 transition-colors">
                            <span className="text-zinc-500 w-16 font-medium shrink-0">{label}</span>
                            <span className="text-zinc-200 flex-1 break-words leading-relaxed">{value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* QRIS Code Card */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl p-6 mx-auto w-fit shadow-2xl ring-4 ring-zinc-900 flex flex-col items-center"
            >
                {/* QRIS Header Simulation */}
                <div className="w-full flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-black tracking-widest text-zinc-800 bg-zinc-100 px-2 py-0.5 rounded">QRIS</span>
                    <span className="text-[9px] font-bold text-zinc-400">GPN</span>
                </div>

                {/* QR Code Canvas Layout */}
                <img src="./qr/qr.jpeg" alt="" />
                <p className="text-center text-zinc-900 font-black text-sm mt-4 tracking-wide">
                    QRIS VersePhone
                </p>
                <p className="text-center text-zinc-500 text-xs mt-0.5 font-medium">
                    Mendukung semua aplikasi e-wallet & e-banking
                </p>
            </motion.div>

            {/* Total Payment Banner */}
            <div className="bg-gradient-to-r from-blue-950/40 to-zinc-900/40 border border-blue-500/20 rounded-xl px-4 py-3.5 flex items-center gap-3.5 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-xl shrink-0 border border-blue-500/20">
                    💡
                </div>
                <div className="flex-1">
                    <p className="text-blue-400 text-sm font-bold">
                        Total Tagihan:{" "}
                        <span className="text-white text-base ml-1 font-black">
                            {product ? formatPrice(product.price) : "—"}
                        </span>
                    </p>
                    <p className="text-zinc-400 text-xs mt-0.5 leading-relaxed">
                        Selesaikan pembayaran lalu lanjut ke langkah berikutnya untuk upload bukti transaksi.
                    </p>
                </div>
            </div>

            {/* Custom Interactive Checkbox */}
            <label className="flex items-center gap-3.5 cursor-pointer select-none group bg-zinc-900/30 hover:bg-zinc-900/60 p-3 rounded-xl border border-transparent hover:border-zinc-800 transition-all">
                <div
                    onClick={() => setConfirmed(!confirmed)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${confirmed
                        ? "bg-blue-600 border-blue-600 shadow-md shadow-blue-600/30 scale-105"
                        : "border-zinc-600 group-hover:border-zinc-400"
                        }`}
                >
                    {confirmed && (
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3.5}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    )}
                </div>
                <span className="text-zinc-300 text-sm font-medium group-hover:text-white transition-colors">
                    Saya konfirmasi sudah membayar sesuai total tagihan
                </span>
            </label>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    className="py-3.5 border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-900 hover:text-white transition-all text-sm tracking-wide"
                >
                    ← Kembali
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onNext}
                    disabled={!confirmed}
                    className={`py-3.5 font-bold rounded-xl transition-all text-sm tracking-wide shadow-md ${confirmed
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/10"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-800/80 cursor-not-allowed"
                        }`}
                >
                    Upload Bukti →
                </motion.button>
            </div>
        </motion.div>
    );
}

// ─── STEP 3: Upload Bukti + Submit ────────────────────────────────────────────
function StepBukti({ info, product, productId, selectedColor, selectedStorage, onBack, onDone }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    const handleFile = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith("image/")) {
            setError("File harus berupa gambar (JPG/PNG/WebP)");
            return;
        }
        if (f.size > 5 * 1024 * 1024) {
            setError("Ukuran file maksimal 5MB");
            return;
        }
        setError("");
        setFile(f);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target.result);
        reader.readAsDataURL(f);
    };

    const handleSubmit = async () => {
        if (!file) {
            setError("Bukti pembayaran wajib diupload");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const fd = new FormData();
            fd.append("id_produk", productId);
            fd.append("first_name", info.first_name);
            fd.append("user_name", info.user_name);
            fd.append("alamat", info.alamat);
            fd.append("no_tlp_or_email", info.no_tlp_or_email);
            fd.append("bukti_pembayaran", file);

            const res = await fetch("/api/payment", {
                method: "POST",
                body: fd,
            });

            const json = await res.json();

            if (!res.ok) throw new Error(json.error || "Gagal memproses transaksi");

            onDone(json.kode_transaksi);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="space-y-6 max-w-md mx-auto"
        >
            {/* Header Section */}
            <div className="text-center sm:text-left">
                <h2 className="text-2xl font-black tracking-tight text-white mb-2">
                    Upload Bukti Bayar
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                    Kirim screenshot resi atau foto fisik bukti transfer QRIS Anda untuk validasi sistem.
                </p>
            </div>

            {/* Interactive Upload Zone Area */}
            <div
                onClick={() => !loading && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all relative overflow-hidden backdrop-blur-sm ${preview
                    ? "border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/5"
                    : "border-zinc-800 hover:border-zinc-600 bg-zinc-900/30 hover:bg-zinc-900/50"
                    } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                    disabled={loading}
                />

                <AnimatePresence mode="wait">
                    {preview ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-4"
                        >
                            <div className="relative mx-auto max-h-52 w-fit rounded-xl overflow-hidden shadow-md border border-zinc-800 bg-zinc-950 p-1">
                                <img
                                    src={preview}
                                    alt="Bukti pembayaran"
                                    className="max-h-48 rounded-lg object-contain block mx-auto"
                                />
                            </div>
                            <div>
                                <p className="text-blue-400 text-sm font-bold truncate max-w-[280px] mx-auto">
                                    {file?.name}
                                </p>
                                <p className="text-zinc-500 text-xs mt-1">
                                    Klik area ini kembali untuk mengganti gambar
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3.5 py-4"
                        >
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-900 flex items-center justify-center border border-zinc-800 shadow-inner text-2xl group-hover:scale-110 transition-transform">
                                📸
                            </div>
                            <div>
                                <p className="text-zinc-200 font-bold text-sm tracking-wide">
                                    Pilih File atau Drop Disini
                                </p>
                                <p className="text-zinc-500 text-xs mt-1">
                                    Format: JPG, PNG, WebP &bull; Maksimal Ukuran 5MB
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Error Message Box */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3.5 text-red-400 text-sm flex items-start gap-3 backdrop-blur-sm"
                >
                    <span className="text-base leading-none bg-red-500/20 w-5 h-5 rounded-full flex items-center justify-center font-bold">!</span>
                    <div className="flex-1 leading-tight font-medium">{error}</div>
                </motion.div>
            )}

            {/* Form Actions Section */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={onBack}
                    disabled={loading}
                    className="py-3.5 border border-zinc-800 text-zinc-400 font-bold rounded-xl hover:bg-zinc-900 hover:text-white transition-all text-sm tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    ← Kembali
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || !file}
                    className={`py-3.5 font-bold rounded-xl transition-all text-sm tracking-wide shadow-md ${!loading && file
                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-800/80 cursor-not-allowed"
                        }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2.5">
                            <svg
                                className="animate-spin w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                />
                            </svg>
                            Memproses...
                        </span>
                    ) : (
                        "Konfirmasi Pesanan ✓"
                    )}
                </motion.button>
            </div>
        </motion.div>
    );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ kodeTransaksi, product, onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-8"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto"
            >
                <svg
                    className="w-10 h-10 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </motion.div>

            <div>
                <h1 className="text-2xl font-black text-white mb-2">
                    Pesanan Berhasil! 🎉
                </h1>
                <p className="text-zinc-400 text-sm">
                    {product?.title} sedang kami proses
                </p>
            </div>

            <div className="bg-zinc-900/60 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
                <p className="text-zinc-500 text-xs uppercase tracking-widest font-bold">
                    Kode Transaksi
                </p>
                <p className="text-2xl font-black text-emerald-400 font-mono tracking-widest">
                    {kodeTransaksi}
                </p>
                <p className="text-zinc-500 text-xs">
                    Simpan kode ini sebagai referensi pesanan kamu
                </p>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4 text-sm text-left space-y-2">
                <p className="text-zinc-300 font-semibold">📋 Status Pesanan</p>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-yellow-400 text-xs font-bold">PENDING</span>
                    <span className="text-zinc-500 text-xs">
                        — menunggu verifikasi pembayaran
                    </span>
                </div>
                <p className="text-zinc-600 text-xs">
                    Tim kami akan memverifikasi bukti pembayaranmu dalam 1×24 jam.
                </p>
            </div>

            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onReset}
                className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-100 transition-all text-sm"
            >
                Kembali ke Toko
            </motion.button>
        </motion.div>
    );
}

// ─── Main Payment Page ────────────────────────────────────────────────────────
export default function PaymentPage() {
    const params = useSearchParams();
    const router = useRouter();

    const productId = params.get("productId");
    const slug = params.get("slug");
    const selectedColor = params.get("warna") || "";
    const selectedStorage = params.get("storage") || "";

    const [step, setStep] = useState(0);
    const [product, setProduct] = useState(null);
    const [kodeTransaksi, setKodeTransaksi] = useState("");

    const [info, setInfo] = useState({
        first_name: "",
        user_name: "",
        no_tlp_or_email: "",
        alamat: "",
    });

    useEffect(() => {
        if (!slug) return;
        fetch(`/api/product/${slug}`)
            .then((r) => r.json())
            .then(setProduct)
            .catch(console.error);
    }, [slug]);

    const handleChange = (key, val) => setInfo((prev) => ({ ...prev, [key]: val }));

    if (kodeTransaksi) {
        return (
            <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <SuccessScreen
                        kodeTransaksi={kodeTransaksi}
                        product={product}
                        onReset={() => router.push("/products")}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            {/* Header */}
            <div className="border-b border-zinc-900 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2 font-black text-lg">
                        
                        VersePhone
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10">
                {/* Left: Form */}
                <div>
                    <StepBar current={step} />

                    <div className="overflow-hidden">
                        <AnimatePresence mode="wait">
                            {step === 0 && (
                                <StepInformasi
                                    key="info"
                                    data={info}
                                    onChange={handleChange}
                                    onNext={() => setStep(1)}
                                />
                            )}
                            {step === 1 && (
                                <StepQRIS
                                    key="qris"
                                    info={info}
                                    product={product}
                                    onBack={() => setStep(0)}
                                    onNext={() => setStep(2)}
                                />
                            )}
                            {step === 2 && (
                                <StepBukti
                                    key="bukti"
                                    info={info}
                                    product={product}
                                    productId={productId}
                                    selectedColor={selectedColor}
                                    selectedStorage={selectedStorage}
                                    onBack={() => setStep(1)}
                                    onDone={(kode) => setKodeTransaksi(kode)}
                                />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right: Sidebar */}
                <div className="hidden lg:block border-l border-zinc-900 pl-10">
                    <ProductSidebar
                        product={product}
                        selectedColor={selectedColor}
                        selectedStorage={selectedStorage}
                    />
                </div>
            </div>
        </div>
    );
}