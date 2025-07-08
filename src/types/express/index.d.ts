import { JwtPayload } from "../jwtPayload.interface";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}