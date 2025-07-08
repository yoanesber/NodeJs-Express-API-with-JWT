import { Request, Response, NextFunction } from "express";

import AppError from "../exceptions/appError.exception";
import JwtUtil from "../utils/jwt.util";
import { JwtPayload } from "../types/jwtPayload.interface";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw AppError.Unauthorized("Missing or invalid Authorization header", "Authorization header must start with 'Bearer '");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        throw AppError.Unauthorized("Missing or invalid token", "Token must be provided in the Authorization");
    }

    try {
        // Verify the JWT token
        const decodedToken = JwtUtil.verifyToken(token) as JwtPayload;
        if (!decodedToken || typeof decodedToken !== 'object') {
            throw AppError.Unauthorized("Invalid token structure", "Decoded token must be an object with user information");
        }

        // Check if the token has expired
        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
            throw AppError.Unauthorized("Token has expired", "The token is no longer valid. Please log in again.");
        }

        // Attach the decoded token to the request object
        // This allows access to user information in subsequent middleware or route handlers
        req.user = decodedToken;

        next();
    } catch (err) {
        if (err instanceof AppError) {
            throw err; // Re-throw known AppErrors
        }

        // Handle unexpected errors
        throw AppError.InternalServerError("An unexpected error occurred during authentication", err);
    }
};
