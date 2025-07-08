import bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";
import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    const now = new Date();
    const password = await bcrypt.hash("P@ssw0rd", 10);

    const users = Array.from({ length: 10 }, (_, i) => {
        const id = i;
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({
            firstName,
            lastName,
        });

        if (id === 0) {
            // Ensure the first user is an admin
            return {
                username: "admin",
                password,
                email: email.toLowerCase(),
                firstname: firstName,
                lastname: lastName,
                isEnabled: true,
                isAccountNonExpired: true,
                isAccountNonLocked: true,
                isCredentialsNonExpired: true,
                isDeleted: false,
                accountExpirationDate: null,
                credentialsExpirationDate: null,
                userType: "USER_ACCOUNT",
                lastLogin: null,
                createdBy: 0,
                createdAt: now,
                updatedBy: 0,
                updatedAt: now,
                deletedBy: null,
                deletedAt: null,
            };
        }

        return {
            username: `user${id}`,
            password,
            email: email.toLowerCase(),
            firstname: firstName,
            lastname: lastName,
            isEnabled: true,
            isAccountNonExpired: true,
            isAccountNonLocked: true,
            isCredentialsNonExpired: true,
            isDeleted: false,
            accountExpirationDate: null,
            credentialsExpirationDate: null,
            userType: "USER_ACCOUNT",
            lastLogin: null,
            createdBy: 1,
            createdAt: now,
            updatedBy: 1,
            updatedAt: now,
            deletedBy: null,
            deletedAt: null,
        };
    });

    await queryInterface.bulkInsert("users", users);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("users", {}, {});
}
