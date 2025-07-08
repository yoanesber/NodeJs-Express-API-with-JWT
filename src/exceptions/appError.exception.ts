class AppError extends Error {
    statusCode: number;
    details?: any;
    name: string;
    
    constructor(name: string, message: string, details?: any, statusCode = 500) {
        super(message);
        this.details = details;
        this.statusCode = statusCode;
        this.name = name;
    }
    
    static BadRequest(message: string, details?: any) {
        return new AppError("BadRequest", message, details, 400);
    }
    
    static Unauthorized(message: string, details?: any) {
        return new AppError("Unauthorized", message, details, 401);
    }

    static Forbidden(message: string, details?: any) {
        return new AppError("Forbidden", message, details, 403);
    }

    static NotFound(message: string, details?: any) {
        return new AppError("NotFound", message, details, 404);
    }

    static InternalServerError(message: string, details?: any) {
        return new AppError("InternalServerError", message, details, 500);
    }

    static Conflict(message: string, details?: any) {
        return new AppError("Conflict", message, details, 409);
    }

    static UnprocessableEntity(message: string, details?: any) {
        return new AppError("UnprocessableEntity", message, details, 422);
    }

    static TooManyRequests(message: string, details?: any) {
        return new AppError("TooManyRequests", message, details, 429);
    }
}

export default AppError;