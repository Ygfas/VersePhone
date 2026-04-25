'use client'

import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShineBorder } from "@/components/ui/shine-border";
import { Eye, EyeOff, Check, X } from "lucide-react";

export default function LoginForm() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // --- LOGIKA VALIDASI PASSWORD ---
    const requirements = useMemo(() => [
        { label: "Minimal 8 karakter", test: (pw) => pw.length >= 8 },
        { label: "Diawali huruf kapital", test: (pw) => /^[A-Z]/.test(pw) },
        { label: "Mengandung angka atau simbol", test: (pw) => /[0-9!@#$%^&*]/.test(pw) },
    ], []);

    // Menghitung berapa syarat yang terpenuhi
    const strengthScore = requirements.filter(req => req.test(password)).length;

    // Menentukan teks status
    const getStrengthLabel = () => {
        if (password.length === 0) return "";
        if (strengthScore === 1) return "Lemah";
        if (strengthScore === 2) return "Sedang";
        if (strengthScore === 3) return "Kuat";
        return "";
    };

    const isPasswordValid = strengthScore === requirements.length;

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!isPasswordValid) return;

        // Simulasi Hashing (Frontend biasanya menggunakan btoa atau library crypto)
        const hashedPassword = btoa(password);
        console.log("Data siap dikirim dengan hash:", hashedPassword);
        // Lanjutkan proses API di sini
    };

    return (
        /* Container Tengah */
        <div className="flex min-h-screen items-center justify-center bg-background p-4 font-sans">

            {/* Wrapper Card */}
            <div className="relative w-full max-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm p-6">

                <Link
                    href="/"
                    className="absolute right-4 top-4 z-10 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Link>

                {/* Header Section */}
                <div className="flex flex-col space-y-1.5 mb-6 text-left">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Sign Up </h3>
                    <p className="text-sm text-muted-foreground">
                        Buat akun Anda untuk mulai berbelanja.
                    </p>
                </div>

                {/* Content Section */}
                <div>
                    <form onSubmit={handleSignUp}>
                        <div className="grid w-full items-center gap-4 text-left">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input id="name" placeholder="Your full name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                <input id="phone" type="tel" placeholder="0812xxxx" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input id="email" type="email" placeholder="name@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password baru"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>

                                {/* Password Strength Visualizer */}
                                {password.length > 0 && (
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

                                        {/* Checklist Syarat */}
                                        <ul className="space-y-1 pt-1">
                                            {requirements.map((req, i) => (
                                                <li key={i} className={`flex items-center gap-2 text-[11px] ${req.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}>
                                                    {req.test(password) ? <Check size={12} /> : <X size={12} />}
                                                    {req.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={!isPasswordValid}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center items-center my-5 text-sm">
                    <p>Sudah punya akun?
                        <Link href="/login" className=" text-blue-500 underline ml-1"> Login di sini</Link>
                    </p>
                </div>

                {/* Efek Animasi Border */}
                <ShineBorder duration={8} size={200} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            </div>
        </div>
    );
}