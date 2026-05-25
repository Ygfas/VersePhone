import { cookies } from "next/headers"
import ProductDetailContent from "./ProductDetailContent"

export default async function ProductDetailPage() {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("user_session")?.value
    const user = sessionCookie ? JSON.parse(sessionCookie) : null

    // Melempar data session aman dari Server Component ke Client Component
    return <ProductDetailContent user={user} />
}