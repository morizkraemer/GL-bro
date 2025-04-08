'use client'
import { useSession } from "next-auth/react";

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const { status } = useSession();
    if (status === "authenticated") {
        return (
            <>{children}</>
        )
    } else if (status === "loading") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Loading...</p>
            </div>
        )
    } else {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p>Please <a className="text-amber-500" href="/admin/auth/login">log in</a> to access this page.</p>
            </div>
        )
    }
}
