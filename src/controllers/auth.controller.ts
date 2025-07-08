import { Request, Response } from "express";

import AuthService from "../services/auth.service";
import FormatResponse from "../utils/response.util";
import { LoginRequestSchema } from "../dtos/loginRequest.dto";
import { RefreshTokenRequestSchema } from "../dtos/refreshTokenRequest.dto";

class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        // Validate the request body against the LoginRequestSchema
        // This will throw a ZodError if validation fails
        const credentials = LoginRequestSchema.parse(req.body);

        // Call the AuthService to handle the login logic
        // This will throw an error if the login fails for any reason
        const token = await AuthService.login(credentials);

        res.status(200).json(
            FormatResponse({
                message: "Login successful",
                data: { token },
                req,
            })
        );
    }

    async refreshToken(req: Request, res: Response): Promise<void> {
        // Validate the request body against the RefreshTokenRequestSchema
        // This will throw a ZodError if validation fails
        const refreshToken = RefreshTokenRequestSchema.parse(req.body);

        // Call the AuthService to handle the refresh token logic
        // This will throw an error if the refresh token is invalid or expired
        const newTokens = await AuthService.refreshToken(refreshToken);

        res.status(200).json(
            FormatResponse({
                message: "Refresh token successful",
                data: { newTokens },
                req,
            })
        );
    }
}

export default new AuthController();
