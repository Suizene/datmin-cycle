const { sequelize } = require('./models');

async function runMigrations() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    
    // Jalankan query SQL langsung
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "resetToken" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP;
    `);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit();
  }
}

runMigrations();
