export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    expirationAt: Date;
    tokenType: string;
}