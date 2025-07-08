import 'dotenv/config';
import fs from "fs";
import jwt, { Algorithm, JwtPayload, SignOptions, VerifyOptions } from "jsonwebtoken";
import path from "path";
import type { StringValue } from "ms";

import AppError from '../exceptions/appError.exception';

type Payload = {
    [key: string]: any
};

class JwtUtil {
    private algorithm: Algorithm;
    private expiresIn: StringValue | number;

    constructor() {
        const alg = process.env.JWT_ALGORITHM || 'HS256';
        if (!alg) {
            throw AppError.InternalServerError('Invalid JWT_ALGORITHM', 'JWT_ALGORITHM is not defined in environment variables');
        }

        // Validate algorithm
        const allowedAlgorithms: Algorithm[] = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'];
        if (!allowedAlgorithms.includes(alg as Algorithm)) {
            throw AppError.InternalServerError(`Invalid JWT_ALGORITHM: ${alg}`, 'JWT_ALGORITHM must be one of HS256, HS384, HS512, RS256, RS384, RS512');
        }

        this.algorithm = alg as Algorithm;
        this.expiresIn = process.env.JWT_EXPIRES_IN as StringValue | number || '1h';
        if (!this.expiresIn) {
            throw AppError.InternalServerError('Invalid JWT_EXPIRES_IN', 'JWT_EXPIRES_IN is not defined in environment variables');
        }
    }

    private getSecretOrKey(): string | Buffer {
        // HS256, HS384, HS512 - use secret from environment variable
        if (this.algorithm.startsWith('HS')) {
            const secret = process.env.JWT_SECRET;
            if (!secret) throw AppError.InternalServerError('Invalid JWT_SECRET', 'JWT_SECRET is not defined in environment variables');
            return secret;
        }

        // RSA - read private key
        const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || './keys/private.pem';
        if (!fs.existsSync(privateKeyPath)) {
            throw AppError.InternalServerError(`Private key file not found at ${privateKeyPath}`, `Ensure JWT_PRIVATE_KEY_PATH is set correctly or the file exists`);
        }
        
        try {
            return fs.readFileSync(path.resolve(privateKeyPath));
        } catch (error) {
            throw AppError.InternalServerError(`Failed to read private key from ${privateKeyPath}`, `Ensure the file exists and is readable: ${error}`);
        }
    }

    private getPublicKey(): string | Buffer {
        // HS256, HS384, HS512 - use secret from environment variable
        if (this.algorithm.startsWith('HS')) {
            const secret = process.env.JWT_SECRET;
            if (!secret) throw AppError.InternalServerError('Invalid JWT_SECRET', 'JWT_SECRET is not defined in environment variables');
            return secret;
        }

        // RSA - read public key
        const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || './keys/public.pem';
        if (!fs.existsSync(publicKeyPath)) {
            throw AppError.InternalServerError(`Public key file not found at ${publicKeyPath}`, `Ensure JWT_PUBLIC_KEY_PATH is set correctly or the file exists`);
        }

        try {
            return fs.readFileSync(path.resolve(publicKeyPath));
        } catch (error) {
            throw AppError.InternalServerError(`Failed to read public key from ${publicKeyPath}`, `Ensure the file exists and is readable: ${error}`);
        }
    }

    sign(payload: Payload): string {
        const options: SignOptions = {
            algorithm: this.algorithm,
            expiresIn: this.expiresIn,
        };

        const secretOrKey = this.getSecretOrKey();
        if (!secretOrKey) {
            throw AppError.InternalServerError('Secret or key not found', 'Ensure JWT_SECRET or JWT_PRIVATE_KEY_PATH is set correctly');
        }

        // Validate payload structure
        if (typeof payload !== 'object' || payload === null) {
            throw AppError.InternalServerError('Invalid payload structure', 'Payload must be a non-null object');
        }

        try {
            return jwt.sign(payload, secretOrKey, options);
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw AppError.InternalServerError('Failed to sign token', error.message);
            } else {
                throw AppError.InternalServerError('Unexpected error during token signing', error);
            }
        }
    }

    verifyToken(token: string): Payload {
        const options: VerifyOptions = {
            algorithms: [this.algorithm],
        };

        const key = this.getPublicKey();
        if (!key) {
            throw AppError.InternalServerError('Public key not found', 'Ensure JWT_PUBLIC_KEY_PATH is set correctly');
        }
        
        try {
            return jwt.verify(token, key, options) as Payload;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw AppError.Unauthorized('Invalid token', error.message);
            } else if (error instanceof jwt.TokenExpiredError) {
                throw AppError.Unauthorized('Token has expired', error.message);
            } else if (error instanceof jwt.NotBeforeError) {
                throw AppError.Unauthorized('Token not active', error.message);
            } else {
                throw AppError.InternalServerError('Failed to verify token', error);
            }
        }
    }

    getExpirationDateFromToken(token: string): Date {
        try {
            // Extract expiration time from the JWT token
            const decodedToken = this.verifyToken(token) as JwtPayload;
            if (!decodedToken || !decodedToken.exp) {
                throw AppError.InternalServerError("Failed to decode JWT token", "Invalid token structure");
            }

            // Calculate expiration date
            return new Date(decodedToken.exp * 1000); // Convert seconds to milliseconds
        } catch (error) {
            throw AppError.InternalServerError('Failed to extract expiration time', error);
        }
    }

    getSpecificClaimFromToken(token: string, claim: string): any {
        try {
            // Verify the token and extract the payload
            const decodedToken = this.verifyToken(token) as JwtPayload;
            if (!decodedToken || !decodedToken[claim]) {
                throw AppError.InternalServerError(`Claim ${claim} not found in token`, "Invalid token structure or claim does not exist");
            }

            // Return the specific claim value
            return decodedToken[claim];
        } catch (error) {
            throw AppError.InternalServerError(`Failed to extract claim ${claim}`, error);
        }
    }
}

export default new JwtUtil();