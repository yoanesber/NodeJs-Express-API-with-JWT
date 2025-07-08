export interface JwtPayload {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname?: string;
    userType?: string;
    roles?: string[];
    iat?: number;
    exp?: number;
}