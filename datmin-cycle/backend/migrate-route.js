const express = require('express');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 5001;

app.get('/migrate', async (req, res) => {
  try {
    await sequelize.authenticate();
    
    await sequelize.query(`
      ALTER TABLE "Users" 
      ADD COLUMN IF NOT EXISTS "resetToken" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP;
    `);
    
    res.send('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    res.status(500).send('Migration failed: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Migration server running on port ${PORT}`);
});
