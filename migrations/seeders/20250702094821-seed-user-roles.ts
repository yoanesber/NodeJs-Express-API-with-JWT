import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    const userRoles = [
        // ROLE_ADMIN
        {
            userId: 1,
            roleId: 3,
        },

        // ROLE_USER
        {
            userId: 2,
            roleId: 1,
        },
        {
            userId: 3,
            roleId: 1,
        },
        {
            userId: 4,
            roleId: 1,
        },
        {
            userId: 5,
            roleId: 1,
        },
        {
            userId: 6,
            roleId: 1,
        },
        {
            userId: 7,
            roleId: 1,
        },
        {
            userId: 8,
            roleId: 1,
        },

        // ROLE_MODERATOR
        {
            userId: 9,
            roleId: 2,
        },
        {
            userId: 10,
            roleId: 2,
        },
    ];

    await queryInterface.bulkInsert("user_roles", userRoles);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("user_roles", {}, {});
}
