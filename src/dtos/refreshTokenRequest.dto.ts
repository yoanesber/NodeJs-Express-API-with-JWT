import { z } from "zod";

export const RefreshTokenRequestSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required").max(500, "Refresh token must not exceed 500 characters"),
});

export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
