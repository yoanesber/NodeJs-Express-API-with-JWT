import bcrypt from "bcryptjs";
import { DatabaseError } from 'sequelize';

import AppError from "../exceptions/appError.exception";
import JwtUtil from "../utils/jwt.util";
import RefreshTokenService from "./refreshToken.service";
import Role from "../models/role.model";
import Sequelize from '../config/db.config';
import User from "../models/user.model";
import UserService from "./user.service";
import { LoginRequest, LoginRequestSchema } from "../dtos/loginRequest.dto";
import { LoginResponse } from "../dtos/loginResponse.dto";
import { RefreshTokenRequest, RefreshTokenRequestSchema } from "../dtos/refreshTokenRequest.dto";
import { RefreshTokenResponse } from "../dtos/refreshTokenResponse.dto";

class AuthService {
    async login(loginRequest: LoginRequest): Promise<LoginResponse> {
        // Validate the login request
        const validationResult = LoginRequestSchema.safeParse(loginRequest);
        if (!validationResult.success) {
            throw AppError.BadRequest("Invalid login request", validationResult.error.errors);
        }

        // Destructure the validated data
        const { username, password } = validationResult.data;

        // Start a transaction
        const t = await Sequelize.transaction();

        try {
            // Find the user by username
            const user = await User.findOne({
                where: { username },
                transaction: t,
                include: [
                    {
                        model: Role,
                        attributes: ["name"],
                    },
                ],
            });
            if (!user) {
                throw AppError.Unauthorized("Invalid username or password", "User not found");
            }

            // Check account flags
            if (!user.isEnabled) throw AppError.Forbidden("Account is disabled", "User account is not enabled. Please contact support.");
            if (!user.isAccountNonExpired) throw AppError.Forbidden("Account is expired", "User account is expired. Please contact support.");
            if (!user.isAccountNonLocked) throw AppError.Forbidden("Account is locked", "User account is locked. Please contact support.");
            if (!user.isCredentialsNonExpired) throw AppError.Forbidden("Credentials are expired", "User credentials are expired. Please contact support.");
            if (user.isDeleted) throw AppError.Forbidden("Account is deleted", "User account is deleted. Please contact support.");

            // Verify the password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw AppError.Forbidden("Invalid username or password", "Password does not match");
            }

            // JWT payload
            const roles = user.roles?.map((role) => role.name) || [];
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                userType: user.userType,
                roles: roles,
            };

            // Generate JWT token
            const accessToken = JwtUtil.sign(payload);

            // Get the expiration date from the token
            const expirationDate = JwtUtil.getExpirationDateFromToken(accessToken);

            // Create or update refresh token
            const refreshToken = await RefreshTokenService.createOrUpdateRefreshToken(user.id, t);

            // Update last login time
            await UserService.updateLastLogin(user.id);

            // Prepare the response
            const response: LoginResponse = {
                accessToken: accessToken,
                refreshToken: refreshToken.token,
                expirationAt: expirationDate,
                tokenType: "Bearer",
            };

            // Commit the transaction
            await t.commit();

            // Return the response
            return response;
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();

            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while logging in due to: ${error.message}`);
            }

            throw AppError.InternalServerError("An unexpected error occurred during login", error);
        }
    }

    async refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        // Validate the refresh token request
        const validationResult = RefreshTokenRequestSchema.safeParse(refreshTokenRequest);
        if (!validationResult.success) {
            throw AppError.BadRequest("Invalid refresh token request", validationResult.error.errors);
        }

        // Destructure the validated data
        const { refreshToken } = validationResult.data;

        // Start a transaction
        const t = await Sequelize.transaction();

        try {
            // Verify the refresh token
            const existingRefreshToken = await RefreshTokenService.verifyRefreshToken(refreshToken, t);
            if (!existingRefreshToken) {
                throw AppError.Unauthorized("Invalid or expired refresh token", "Refresh token is not valid or has expired");
            }

            // Find the user associated with the refresh token
            const user = await User.findByPk(existingRefreshToken.userId, {
                transaction: t,
                include: [
                    {
                        model: Role,
                        attributes: ["name"],
                    },
                ],
            });
            if (!user) {
                throw AppError.Unauthorized("User not found", "No user associated with this refresh token");
            }

            // JWT payload
            const roles = user.roles?.map((role) => role.name) || [];
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                firstname: user.firstname,
                lastname: user.lastname,
                userType: user.userType,
                roles: roles,
            };

            // Generate new JWT token
            const accessToken = JwtUtil.sign(payload);

            // Get the expiration date from the token
            const expirationDate = JwtUtil.getExpirationDateFromToken(accessToken);

            // Create or update refresh token
            const newRefreshToken = await RefreshTokenService.createOrUpdateRefreshToken(user.id, t);

            // Prepare the response
            const response: RefreshTokenResponse = {
                accessToken: accessToken,
                refreshToken: newRefreshToken.token,
                expirationAt: expirationDate,
                tokenType: "Bearer",
            };

            // Commit the transaction
            await t.commit();

            // Return the response
            return response;
        } catch (error) {
            // Rollback the transaction in case of error
            await t.rollback();
            
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }

            if (error instanceof DatabaseError) {
                throw AppError.InternalServerError("Database error", `An error occurred while refreshing the token due to: ${error.message}`);
            }

            throw AppError.InternalServerError("An unexpected error occurred during token refresh", error);
        }
    }
}

export default new AuthService();
