export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    expirationAt: Date;
    tokenType: string;
}