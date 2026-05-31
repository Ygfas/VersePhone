'use client'

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShineBorder } from "@/components/ui/shine-border";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState({ type: "", text: "" });

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const requirements = useMemo(() => [
        { label: "Minimal 8 karakter", test: (pw) => pw.length >= 8 },
        { label: "Diawali huruf kapital", test: (pw) => /^[A-Z]/.test(pw) },
        { label: "Mengandung angka atau simbol", test: (pw) => /[0-9!@#$%^&*]/.test(pw) },
    ], []);

    const strengthScore = requirements.filter(req => req.test(formData.password)).length;

    const getStrengthLabel = () => {
        if (formData.password.length === 0) return "";
        if (strengthScore === 1) return "Lemah";
        if (strengthScore === 2) return "Sedang";
        if (strengthScore === 3) return "Kuat";
        return "";
    };

    const isPasswordValid = strengthScore === requirements.length;

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        setLoading(true);
        setAlertMsg({ type: "", text: "" });

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal melakukan registrasi.");
            }

            setAlertMsg({
                type: "success",
                text: `Registrasi berhasil! Gunakan username: "${data.username}" atau Email Anda.`
            });

            setTimeout(() => {
                router.push("/login");
            }, 2500);

        } catch (err) {
            setAlertMsg({ type: "error", text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">
            <div className="relative w-full max-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm p-6">

                <Link href="/" className="absolute right-4 top-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Link>

                <div className="flex flex-col space-y-1.5 mb-6 text-left">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Sign Up</h3>
                    <p className="text-sm text-muted-foreground">Buat akun Anda untuk mulai berbelanja.</p>
                </div>

                {alertMsg.text && (
                    <div className={`p-3 rounded-lg text-xs font-medium mb-4 text-left ${alertMsg.type === "success"
                            ? "bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                        {alertMsg.text}
                    </div>
                )}

                <form onSubmit={handleSignUp}>
                    <div className="grid w-full items-center gap-4 text-left">
                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="name" className="text-sm font-medium">Name / Username</label>
                            <input id="name" required value={formData.name} onChange={handleInputChange} placeholder="Your full name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <input id="phone" type="tel" required value={formData.phone} onChange={handleInputChange} placeholder="0812xxxx" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input id="email" type="email" required value={formData.email} onChange={handleInputChange} placeholder="name@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    required
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Masukkan password baru"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                />
                                {/* FIXED ICON LOGIC */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {formData.password.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Kekuatan: {getStrengthLabel()}</span>
                                    </div>
                                    <div className="flex gap-1.5 h-1.5">
                                        {[1, 2, 3].map((s) => (
                                            <div
                                                key={s}
                                                className={`h-full flex-1 rounded-full transition-all duration-500 ${strengthScore >= s
                                                    ? (strengthScore === 1 ? 'bg-red-500' : strengthScore === 2 ? 'bg-yellow-500' : 'bg-green-500')
                                                    : 'bg-neutral-200 dark:bg-neutral-800'
                                                    }`}
                                            />
                                        ))}
                                    </div>

                                    <ul className="space-y-1 pt-1">
                                        {requirements.map((req, i) => (
                                            <li key={i} className={`flex items-center gap-2 text-[11px] ${req.test(formData.password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                {req.test(formData.password) ? <Check size={12} /> : <X size={12} />}
                                                {req.label}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between items-center pt-6">
                        <Button type="submit" className="w-full" disabled={!isPasswordValid || loading}>
                            {loading ? "Mendaftarkan..." : "Sign Up"}
                        </Button>
                    </div>
                </form>

                <div className="flex justify-center items-center my-5 text-sm">
                    <p>Sudah punya akun?
                        <Link href="/login" className="text-blue-500 underline ml-1"> Login di sini</Link>
                    </p>
                </div>

                <ShineBorder duration={8} size={200} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            </div>
        </div>
    );
}