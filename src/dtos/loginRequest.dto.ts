import { z } from "zod";

export const LoginRequestSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must not exceed 20 characters"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(150, "Password must not exceed 150 characters"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
