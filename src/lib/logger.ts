const isProd = process.env.NODE_ENV === "production"

export function logError(error: unknown, context?: string) {
    if (isProd) {
        //TODO SENTRY
    } else {
        console.error("Error: ", error)
        if (context) console.info("Error Context: ", context)
    }
}
