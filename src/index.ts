import "dotenv/config";
import readline from "readline";

import app from "./app";
import sequelize from "./config/db.config";
import { connectDB } from "./config/db.config";

// Connect to the database
connectDB();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle Ctrl+C on Windows PowerShell
if (process.platform === "win32") {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.on("SIGINT", () => {
        process.emit("SIGINT"); // manual trigger shutdown
    });
}

// Graceful shutdown
const shutdown = async () => {
    console.log("\nShutting down gracefully...");

    try {
        // 1. Close database connection
        await sequelize.close();
        console.log("Database connection closed");

        // 2. Close server
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });

        // 3. Handle any remaining requests
        setTimeout(() => {
            console.error("Forcing shutdown after timeout");
            process.exit(1);
        }, 5000); // 5 seconds timeout
    } catch (err) {
        console.error("Error closing server:", err);
        process.exit(1);
    }
};

// Handle termination signals
process.on("SIGINT", shutdown); // Ctrl+C
process.on("SIGTERM", shutdown); // Heroku or other platforms
