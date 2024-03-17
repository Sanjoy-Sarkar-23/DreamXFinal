if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const faker = require('faker');

// Replace 'Listing' with your actual Mongoose model
const Listing = require('./models/listing');

const dbUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
    touchAfter: 24 * 3600, // time period in seconds
});

async function main() {
    await mongoose.connect(dbUrl);
}

const generateFakeData = () => {
    const randomCategory = faker.random.arrayElement(['Bike', 'Car']);
    const randomBrand = faker.random.arrayElement(['TATA', 'TVS', 'Honda', 'Hyundai', 'Yamaha', 'Hero', 'Bajaj', 'Royel Enfield', 'Suzuki']);
    const randomBodyType = faker.random.arrayElement(['Motorcycles', 'Scooters', 'Hatchback', 'Sedan', 'SUV', 'Minivan', 'MUV']);
    const randomFuelType = faker.random.arrayElement(['Patrol', 'Diesel', 'CNG', 'EV']);

    return {
        buying: faker.random.number({ min: 2000, max: 2022 }),
        name: faker.vehicle.vehicle(),
        kms: faker.random.number({ min: 0, max: 100000 }),
        brand: randomBrand,
        model: faker.vehicle.model(),
        category: randomCategory,
        bodyType: randomBodyType,
        fuelType: randomFuelType,
        description: faker.lorem.paragraph(),
        images: [{
            url: `https://source.unsplash.com/800x600/?${randomCategory.toLowerCase()}`,
            filename: faker.system.fileName(),
        }],
        moreImages: Array.from({ length: faker.random.number({ min: 0, max: 4 }) }, (_, index) => ({
            url: `https://source.unsplash.com/800x600/?${randomCategory.toLowerCase()}${index + 2}`,
            filename: faker.system.fileName(),
        })),
        price: faker.random.number({ min: 1000, max: 50000 }),
        isStatus: faker.random.boolean(),
        // createdAt: faker.date.past(),
        wishListUser: Array.from({ length: faker.random.number({ min: 0, max: 10 }) }, () => faker.internet.userName()),
    };
};


const initDb = async () => {
    try {
        await Listing.deleteMany({});
        const fakeDataArray = Array.from({ length: 100 }, () => generateFakeData());
        await Listing.insertMany(fakeDataArray);
        console.log("Data was initialized");
    } catch (error) {
        console.error("Error initializing data:", error);
    } finally {
        await mongoose.connection.close();
    }
};


main().then(() => {
    console.log("Connected to DB");
    initDb();
}).catch((err) => console.error(err));
