import {MigrationInterface, QueryRunner} from "typeorm";

export class init1578009371123 implements MigrationInterface {
    name = 'init1578009371123'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "player_game_state" ("name" character varying NOT NULL, "version" integer NOT NULL, "gameState" jsonb NOT NULL, CONSTRAINT "PK_f6188a465e6ecf83a12f803b846" PRIMARY KEY ("name"))`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "player_game_state"`, undefined);
    }

}
