'use client'

import { Button } from "@/components/ui/button"

export default function Error({error, reset}: {error: Error, reset: () => void}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-muted-foreground">{error.message}</p>
            <Button onClick={reset}>Try again</Button>
        </div>
    )
} 