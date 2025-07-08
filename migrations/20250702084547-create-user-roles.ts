import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable("user_roles", {
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onUpdate: "RESTRICT",
            onDelete: "SET NULL",
        },
        roleId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
            onUpdate: "RESTRICT",
            onDelete: "SET NULL",
        },
    });

    // (Optional) Add unique constraint to prevent duplicate pairs
    await queryInterface.addConstraint("user_roles", {
        fields: ["userId", "roleId"],
        type: "unique",
        // name: "unique_user_role_pair",
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("user_roles");
}
