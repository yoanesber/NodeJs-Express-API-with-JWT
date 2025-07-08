import { JwtPayload } from "../jwtPayload.interface"; // atau sesuaikan path-nya

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}