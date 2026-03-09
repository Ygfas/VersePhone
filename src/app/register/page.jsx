import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShineBorder } from "@/components/ui/shine-border";

export default function LoginForm() {
    return (
        /* Container Tengah */
        <div className="flex min-h-screen items-center justify-center bg-background p-4">

            {/* Wrapper Card */}
            <div className="relative w-full max-w-[350px] overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm p-6">


                <Link
                    href="/"
                    className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
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
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Sign Up </h3>
                    <p className="text-sm text-muted-foreground">
                        Enter your credentials to access your account.
                    </p>
                </div>

                {/* Content Section */}
                <div>
                    <form>
                        <div className="grid w-full items-center gap-4 text-left">
                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input id="name" placeholder="Your full name" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                <input id="phone" type="tel" placeholder="0812xxxx" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium">Email or Username</label>
                                <input id="email" type="email" placeholder="name@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="password" shake-b className="text-sm font-medium">Password</label>
                                <input id="password" type="password" placeholder="Enter your password" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer Section */}
                <div className="flex justify-between items-center pt-6 gap-2">

                    <Button className="flex-1"><Link href="/">Sign Up</Link></Button>
                </div>
                <div className="flex justify-center items-center my-5">
                    <h1>Sudah punya akun?
                        <Link href="/login" className=" text-blue-500 underline"> Login di sini</Link>
                    </h1>
                </div>

                {/* Efek Animasi Border */}
                <ShineBorder duration={8} size={100} />
            </div>
        </div>
    );
}