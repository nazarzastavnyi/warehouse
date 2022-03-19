export interface Token {
    token: string,
    refresh_token: string
}

export interface ErrorResponse {
    status: number,
    message: string
}
