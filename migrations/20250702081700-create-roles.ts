import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable("roles", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        createdBy: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            // defaultValue: DataTypes.NOW,
            defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedBy: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            // defaultValue: DataTypes.NOW,
            defaultValue: queryInterface.sequelize.literal("CURRENT_TIMESTAMP"),
        },
        deletedBy: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("roles");
}
