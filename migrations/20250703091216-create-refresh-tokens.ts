import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable("refresh_tokens", {
        token: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
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
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    });

    // (Optional) Add unique constraint to prevent duplicate pairs
    await queryInterface.addConstraint("refresh_tokens", {
        fields: ["userId"],
        type: "unique",
        // name: "unique_user_refresh_token",
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("refresh_tokens");
}
