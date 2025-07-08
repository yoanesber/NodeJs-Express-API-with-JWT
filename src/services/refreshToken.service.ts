import 'dotenv/config';
import { DatabaseError } from 'sequelize';
import { Transaction } from "sequelize";

import AppError from "../exceptions/appError.exception";
import RefreshToken from "../models/refreshToken.model";

class RefreshTokenService {
    async createOrUpdateRefreshToken(userId: number, transaction?: Transaction): Promise<RefreshToken> {
        // Validate the userId
        if (!userId) throw AppError.BadRequest("Invalid user ID", "User ID is required to create a refresh token");
        
        try {
            // Check if a refresh token already exists for the user
            const existingToken = await RefreshToken.findOne({
                where: { userId },
                transaction: transaction,
            });

            if (existingToken) {
                // If a token exists, delete it
                await existingToken.destroy();
            }

            // Create a new refresh token
            const expirationHours = parseInt(process.env.REFRESH_TOKEN_EXPIRATION_HOURS || '720', 10); // Default to 30 days if not set
            if (isNaN(expirationHours) || expirationHours <= 0) {
                throw AppError.InternalServerError("Invalid REFRESH_TOKEN_EXPIRATION_HOURS", "REFRESH_TOKEN_EXPIRATION_HOURS must be a positive number");
            }
            const refreshToken = await RefreshToken.create({
                userId,
                expiresAt: new Date(Date.now() + expirationHours * 60 * 60 * 1000), // Set expiration date
            }, { transaction: transaction });

            return refreshToken;
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while creating or updating the refresh token due to: ${error.message}`);
            }

            throw AppError.InternalServerError("Failed to create or update refresh token", error);
        }
    }

    async verifyRefreshToken(token: string, transaction?: Transaction): Promise<RefreshToken | null> {
        // Validate the token
        if (!token) throw AppError.BadRequest("Invalid refresh token", "Refresh token is required");

        try {
            // Find the refresh token in the database
            const refreshToken = await RefreshToken.findOne({
                where: { token },
                transaction: transaction,
            });

            if (!refreshToken) {
                throw AppError.Unauthorized("Invalid or expired refresh token", "Refresh token not found");
            }

            // Check if the token has expired
            if (new Date() > refreshToken.expiresAt) {
                throw AppError.Unauthorized("Expired refresh token", "Refresh token has expired");
            }

            return refreshToken;
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }
            
            throw AppError.InternalServerError("Failed to verify refresh token", error);
        }
    }
}

export default new RefreshTokenService();
