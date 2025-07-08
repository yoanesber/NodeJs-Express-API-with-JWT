import AppError from "../exceptions/appError.exception";
import User from "../models/user.model";

class UserService {
    async updateLastLogin(userId: number): Promise<boolean> {
        // Validate the userId
        if (!userId) throw AppError.BadRequest("Invalid user ID", "User ID is required to create a refresh token");
        
        try {
            // Update the last login time
            const [affectedCount] = await User.update(
                { 
                    lastLogin: new Date(),
                    updatedBy: userId, // Assuming the userId is the one updating
                 },
                {
                    where: { id: userId },
                    // returning: true, // Return the updated rows
                    // individualHooks: true, // Use hooks if defined
                }
            );

            if (affectedCount === 0) {
                throw AppError.NotFound("User not found", "No user found with the provided ID");
            }

            return true;
        } catch (error) {
            if (error instanceof AppError) {
                throw error; // Re-throw known AppErrors
            }
            throw AppError.InternalServerError("Failed to update last login", error);
        }
    }
}

export default new UserService();
