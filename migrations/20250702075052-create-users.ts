import { QueryInterface, DataTypes } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable("users", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        firstname: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        isEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isAccountNonExpired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isAccountNonLocked: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isCredentialsNonExpired: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        accountExpirationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        credentialsExpirationDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        userType: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isIn: [["SERVICE_ACCOUNT", "USER_ACCOUNT"]],
            },
        },
        lastLogin: {
            type: DataTypes.DATE,
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
    await queryInterface.dropTable("users");
}
