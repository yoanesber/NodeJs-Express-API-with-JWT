import { faker } from "@faker-js/faker";
import { QueryInterface } from "sequelize";

export async function up(queryInterface: QueryInterface) {
    const now = new Date();

    const notes = Array.from({ length: 20 }).map(() => ({
        id: faker.string.uuid(),
        title: faker.lorem.sentence(3),
        content: faker.lorem.paragraphs(3),
        createdBy: 1,
        createdAt: now,
        updatedBy: 1,
        updatedAt: now,
        deletedBy: null,
        deletedAt: null,
    }));

    await queryInterface.bulkInsert("notes", notes);
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.bulkDelete("notes", {}, {});
}
