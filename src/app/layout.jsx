// app/layout.js
export default function RootLayout({ children }) {
    return (
        <html lang="en" className="scroll-smooth" suppressHydrationWarning>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}