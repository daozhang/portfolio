import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePortfoliosTable1698000002000 implements MigrationInterface {
  name = 'CreatePortfoliosTable1698000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create portfolio_template enum
    await queryRunner.query(`
      CREATE TYPE "portfolio_template_enum" AS ENUM('gallery', 'about', 'contact')
    `);

    // Create portfolios table
    await queryRunner.query(`
      CREATE TABLE "portfolios" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "userId" uuid NOT NULL,
        "title" character varying NOT NULL,
        "template" "portfolio_template_enum" NOT NULL DEFAULT 'gallery',
        "blocks" jsonb NOT NULL DEFAULT '[]',
        "theme" character varying NOT NULL DEFAULT 'default',
        "isPublished" boolean NOT NULL DEFAULT false,
        "publicUrl" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_portfolios_id" PRIMARY KEY ("id")
      )
    `);

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_portfolios_userId" ON "portfolios" ("userId")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_portfolios_isPublished" ON "portfolios" ("isPublished")
    `);

    // Add foreign key constraint to users table
    await queryRunner.query(`
      ALTER TABLE "portfolios" 
      ADD CONSTRAINT "FK_portfolios_user_id" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Add portfolio foreign key to media_files table
    await queryRunner.query(`
      ALTER TABLE "media_files" 
      ADD CONSTRAINT "FK_media_files_portfolio_id" 
      FOREIGN KEY ("portfolioId") REFERENCES "portfolios"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "media_files" DROP CONSTRAINT "FK_media_files_portfolio_id"`);
    await queryRunner.query(`ALTER TABLE "portfolios" DROP CONSTRAINT "FK_portfolios_user_id"`);
    await queryRunner.query(`DROP INDEX "IDX_portfolios_isPublished"`);
    await queryRunner.query(`DROP INDEX "IDX_portfolios_userId"`);
    await queryRunner.query(`DROP TABLE "portfolios"`);
    await queryRunner.query(`DROP TYPE "portfolio_template_enum"`);
  }
}