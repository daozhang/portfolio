import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaFilesTable1698000001000 implements MigrationInterface {
  name = 'CreateMediaFilesTable1698000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create media_files table
    await queryRunner.query(`
      CREATE TABLE "media_files" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "portfolioId" uuid,
        "originalName" character varying NOT NULL,
        "urls" jsonb NOT NULL,
        "metadata" jsonb NOT NULL,
        "projectDetails" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_media_files_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_MEDIA_FILES_USER_ID" ON "media_files" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_MEDIA_FILES_PORTFOLIO_ID" ON "media_files" ("portfolioId")
    `);

    // Add foreign key constraint to users table
    await queryRunner.query(`
      ALTER TABLE "media_files" 
      ADD CONSTRAINT "FK_media_files_user_id" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Note: Portfolio foreign key will be added when portfolios table is created
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "media_files" DROP CONSTRAINT "FK_media_files_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_MEDIA_FILES_PORTFOLIO_ID"`);
    await queryRunner.query(`DROP INDEX "IDX_MEDIA_FILES_USER_ID"`);
    await queryRunner.query(`DROP TABLE "media_files"`);
  }
}