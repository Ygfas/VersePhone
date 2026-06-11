'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShineBorder } from "@/components/ui/shine-border";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ambil nilai ?callbackUrl= dari URL jika ada
    const callbackUrl = searchParams.get("callbackUrl");

    const [showPassword, setShowPassword] = useState(false);
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            const data = await res.json();

            if (res.ok) {
                // Tarik data session cookie terbaru dari server
                router.refresh();

                // Berikan jeda 100ms agar server sempat memproses cookie baru
                setTimeout(() => {
                    if (data.role === "admin") {
                        router.push("/dashboard");
                    } else if (callbackUrl) {
                        router.push(decodeURIComponent(callbackUrl));
                    } else {
                        router.push("/");
                    }
                }, 100);

            } else {
                setErrorMessage(data.message || "Login gagal.");
            }
        } catch (error) {
            setErrorMessage("Gagal menghubungi server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Container Tengah */
        <div className="flex min-h-screen items-center justify-center bg-background p-4">

            {/* Wrapper Card */}
            <div className="relative w-full max-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm p-6">

                <Link
                    href="/"
                    className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                    >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                    <span className="sr-only">Close</span>
                </Link>

                {/* Header Section */}
                <div className="flex flex-col space-y-1.5 mb-6 text-left">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Login</h3>
                    <p className="text-sm text-muted-foreground">
                        Masukkan kredensial Anda untuk mengakses akun Anda.
                    </p>
                </div>

                {/* Info Box Alert (Menggantikan sistem alert pop-up bising) */}
                {errorMessage && (
                    <div className="p-3 rounded-lg text-xs font-medium mb-4 text-left bg-red-100 text-red-800 dark:bg-red-950/30 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                {/* Content Section */}
                <div>
                    <form onSubmit={handleLogin}>
                        <div className="grid w-full items-center gap-4 text-left">

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email or Username</label>
                                <input
                                    id="email"
                                    type="text"
                                    required
                                    value={emailOrUsername}
                                    onChange={(e) => setEmailOrUsername(e.target.value)}
                                    placeholder="name@example.com / username"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password" className="text-sm font-medium">Password</label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Masukkan password anda"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />

                                    {/* Tombol Show/Hide - SUDAH DIPERBAIKI LOGIKANYA */}
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="flex justify-between items-center pt-6 gap-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Loading..." : "Login"}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="flex justify-center items-center my-5 text-sm">
                    <p>Belum punya akun?
                        <Link href="/register" className="text-blue-500 underline ml-1">Daftar di sini</Link>
                    </p>
                </div>

                {/* Efek Animasi Border */}
                <ShineBorder duration={8} size={200} shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
            </div>
        </div>
    );
}