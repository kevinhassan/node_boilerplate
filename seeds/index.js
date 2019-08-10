const config = require('../config');
require('../database')(config);
// Get Seeders
const seeders = [];
seeders.push(require('./UserSeeder'));

// Seed all collections
async function seedAll() {
    try {
        await Promise.all(seeders.map(async seeder => seeder.seed()));
        process.exit(0);
    } catch (e) {
        process.exit(1);
    }
}
seedAll();
