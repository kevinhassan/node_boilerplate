const mocks = require('../mocks/users.json');
const User = require('../models/User');

const UserSeeder = {};
UserSeeder.dropDatabase = async () => {
    console.log('Removing User collection ...');
    try {
        await User.deleteMany();
        console.log('User collection removed');
    } catch (error) {
        console.log(`Error:${error}`);
        process.exit(1);
    }
};

UserSeeder.fillDatabase = async () => {
    console.log('Seeding Users...');
    try {
        await Promise.all(mocks.map(user => new User(user).save()));
        console.log('User collection filled');
    } catch (error) {
        console.log(`Error:${error}`);
        process.exit(1);
    }
};


UserSeeder.seed = async () => {
    await UserSeeder.dropDatabase();
    await UserSeeder.fillDatabase();
};

module.exports = UserSeeder;
