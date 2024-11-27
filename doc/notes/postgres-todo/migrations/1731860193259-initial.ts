import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1731860193259 implements MigrationInterface {
  name = 'Initial1731860193259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "password" character varying NOT NULL, "version" integer NOT NULL, "createdAt" bigint, "updatedAt" bigint, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorite" ("userId" character varying NOT NULL, "artistId" uuid, "albumId" uuid, "trackId" uuid, CONSTRAINT "PK_83b775fdebbe24c29b2b5831f2d" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "year" integer NOT NULL, "artistId" uuid, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "artist" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "grammy" boolean NOT NULL, CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "track" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "artistId" uuid, "albumId" uuid, "duration" integer NOT NULL, CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "FK_0b7b9c184c74b5d0ae32796c62d" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "FK_4d3e1db289b90223ee9aa3835ae" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" ADD CONSTRAINT "FK_a1aa0ad0d3036ae303984b553d7" FOREIGN KEY ("trackId") REFERENCES "track"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" ADD CONSTRAINT "FK_3d06f25148a4a880b429e3bc839" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" ADD CONSTRAINT "FK_b105d945c4c185395daca91606a" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_b105d945c4c185395daca91606a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "track" DROP CONSTRAINT "FK_997cfd9e91fd00a363500f72dc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "album" DROP CONSTRAINT "FK_3d06f25148a4a880b429e3bc839"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" DROP CONSTRAINT "FK_a1aa0ad0d3036ae303984b553d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" DROP CONSTRAINT "FK_4d3e1db289b90223ee9aa3835ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite" DROP CONSTRAINT "FK_0b7b9c184c74b5d0ae32796c62d"`,
    );
    await queryRunner.query(`DROP TABLE "track"`);
    await queryRunner.query(`DROP TABLE "artist"`);
    await queryRunner.query(`DROP TABLE "album"`);
    await queryRunner.query(`DROP TABLE "favorite"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
