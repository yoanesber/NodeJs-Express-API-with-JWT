import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable("notes", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
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
    await queryInterface.dropTable("notes");
}
