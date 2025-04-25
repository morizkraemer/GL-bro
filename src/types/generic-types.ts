export type PageState = "idle" | "loading" | "error" | "success"

export type PageError = {
    code: "auth" | "missingResource" | "internal" | "generic";
    message: string
}

type ActionSuccess<T> = {
    data: T;
    error?: undefined;
}
type ActionError = {
    data?: undefined;
    error: PageError
}
export type ActionResult<T> = ActionSuccess<T> | ActionError
