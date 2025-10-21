import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserAndInviteCodeTables1698000000000 implements MigrationInterface {
  name = 'CreateUserAndInviteCodeTables1698000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('artist', 'admin')
    `);
    
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        "name" character varying,
        "bio" text,
        "avatar" character varying,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'artist',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Create invite_codes table
    await queryRunner.query(`
      CREATE TABLE "invite_codes" (
        "code" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "isUsed" boolean NOT NULL DEFAULT false,
        "createdBy" character varying NOT NULL,
        "usedBy" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "usedAt" TIMESTAMP,
        CONSTRAINT "PK_b0c8f4c0c8416b9fc6f907b7433" PRIMARY KEY ("code")
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "invite_codes" 
      ADD CONSTRAINT "FK_invite_codes_created_by" 
      FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "invite_codes" 
      ADD CONSTRAINT "FK_invite_codes_used_by" 
      FOREIGN KEY ("usedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "invite_codes" DROP CONSTRAINT "FK_invite_codes_used_by"`);
    await queryRunner.query(`ALTER TABLE "invite_codes" DROP CONSTRAINT "FK_invite_codes_created_by"`);
    await queryRunner.query(`DROP TABLE "invite_codes"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}