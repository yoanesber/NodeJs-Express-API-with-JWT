import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    const now = new Date();

    const roles = [
        {
            name: "ROLE_USER",
            description: "Regular user with basic access rights",
            createdBy: 1,
            createdAt: now,
            updatedBy: 1,
            updatedAt: now,
            deletedBy: null,
            deletedAt: null,
        },
        {
            name: "ROLE_MODERATOR",
            description: "User with moderation rights",
            createdBy: 1,
            createdAt: now,
            updatedBy: 1,
            updatedAt: now,
            deletedBy: null,
            deletedAt: null,
        },
        {
            name: "ROLE_ADMIN",
            description: "Administrator with full access rights",
            createdBy: 1,
            createdAt: now,
            updatedBy: 1,
            updatedAt: now,
            deletedBy: null,
            deletedAt: null,
        },
    ];

    await queryInterface.bulkInsert("roles", roles);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("roles", {}, {});
}
