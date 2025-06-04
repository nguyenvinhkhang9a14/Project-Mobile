const seed = require('./seeds/seed');

console.log('Running database seed script...');

seed()
  .then(() => {
    console.log('Database seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }); 