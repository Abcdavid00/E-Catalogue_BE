import { MigrationInterface, QueryRunner } from "typeorm";

export class AddItemRel1703600023908 implements MigrationInterface {
    name = 'AddItemRel1703600023908'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_items_item\` (\`orderId\` int NOT NULL, \`itemId\` int NOT NULL, INDEX \`IDX_98444c0ad52b9e6e2b1f8f1a7d\` (\`orderId\`), INDEX \`IDX_beae103ca77096a308d911bc0b\` (\`itemId\`), PRIMARY KEY (\`orderId\`, \`itemId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_items_item\` (\`cartId\` int NOT NULL, \`itemId\` int NOT NULL, INDEX \`IDX_0b7c4a16d6714906b570a9b342\` (\`cartId\`), INDEX \`IDX_92d4bcfea283248919ff00fb50\` (\`itemId\`), PRIMARY KEY (\`cartId\`, \`itemId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_items_item\` ADD CONSTRAINT \`FK_98444c0ad52b9e6e2b1f8f1a7df\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`order_items_item\` ADD CONSTRAINT \`FK_beae103ca77096a308d911bc0b8\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cart_items_item\` ADD CONSTRAINT \`FK_0b7c4a16d6714906b570a9b342e\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`cart_items_item\` ADD CONSTRAINT \`FK_92d4bcfea283248919ff00fb50b\` FOREIGN KEY (\`itemId\`) REFERENCES \`item\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_items_item\` DROP FOREIGN KEY \`FK_92d4bcfea283248919ff00fb50b\``);
        await queryRunner.query(`ALTER TABLE \`cart_items_item\` DROP FOREIGN KEY \`FK_0b7c4a16d6714906b570a9b342e\``);
        await queryRunner.query(`ALTER TABLE \`order_items_item\` DROP FOREIGN KEY \`FK_beae103ca77096a308d911bc0b8\``);
        await queryRunner.query(`ALTER TABLE \`order_items_item\` DROP FOREIGN KEY \`FK_98444c0ad52b9e6e2b1f8f1a7df\``);
        await queryRunner.query(`DROP INDEX \`IDX_92d4bcfea283248919ff00fb50\` ON \`cart_items_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_0b7c4a16d6714906b570a9b342\` ON \`cart_items_item\``);
        await queryRunner.query(`DROP TABLE \`cart_items_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_beae103ca77096a308d911bc0b\` ON \`order_items_item\``);
        await queryRunner.query(`DROP INDEX \`IDX_98444c0ad52b9e6e2b1f8f1a7d\` ON \`order_items_item\``);
        await queryRunner.query(`DROP TABLE \`order_items_item\``);
    }

}
