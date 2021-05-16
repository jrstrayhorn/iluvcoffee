import {MigrationInterface, QueryRunner} from "typeorm";

export class SchemaSync1621169275959 implements MigrationInterface {
    name = 'SchemaSync1621169275959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `coffee` ADD `description` varchar(255) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `coffee` DROP COLUMN `description`");
    }

}
