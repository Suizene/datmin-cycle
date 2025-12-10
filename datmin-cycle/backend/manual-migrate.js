require('dotenv').config();
const { Sequelize } = require('sequelize');

// Gunakan DATABASE_URL dari environment variable
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: console.log,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke database berhasil.');

    // Jalankan query untuk menambahkan kolom jika belum ada
    await sequelize.query(`
      DO $$
      BEGIN
        BEGIN
          ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "resetToken" VARCHAR(255);
          ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP;
          RAISE NOTICE 'Kolom berhasil ditambahkan';
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Error: %', SQLERRM;
        END;
      END $$;
    `);

    console.log('Migrasi selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Error saat migrasi:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

runMigration();
