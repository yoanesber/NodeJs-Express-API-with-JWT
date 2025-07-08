import { Request, Response, NextFunction } from "express";

import AppError from "../exceptions/appError.exception";

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(AppError.NotFound("Resource not found", `The requested resource at '${req.originalUrl}' could not be found.`));
};

export default notFound;
