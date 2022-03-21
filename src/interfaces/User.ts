export interface UserRequest {
    login: string;
    password: string;
    is_auth?: boolean;
}

export interface UserResponse {
    login: string;
}
