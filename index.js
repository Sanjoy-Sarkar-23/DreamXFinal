if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const faker = require('faker');
const dbUrl = process.env.ATLASDB_URL;

const carImageList = [
    'https://images.unsplash.com/photo-1591680725296-77cfb5896d22?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8dmVoaWNsZXx8fHx8fDE3MDczMjk5Nzk&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1558486799-4ec09fdb129c?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8dmVoaWNsZXx8fHx8fDE3MDczMzAxMzg&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    // Add other car image URLs
];

const bikeImageList = [
    'https://images.unsplash.com/photo-1558979159-2b18a4070a87?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8TW90b3JjeWNsZXx8fHx8fDE3MDczMzAyNjM&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    'https://images.unsplash.com/photo-1577766143388-6a96b2cc9b21?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8TW90b3JjeWNsZXx8fHx8fDE3MDczMzAyNTQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=800',
    // Add other bike image URLs
];

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    secret: process.env.SECRET,
    touchAfter: 24 * 3600, // time period in seconds
});

async function main() {
    mongoose.connect(dbUrl, {
        useNewURLParser: true,
        useUnifiedTopology: true,

    }, 6000000)

        .then(console.log("connected to server"))
        .catch((err) => console.log(err));
}

const listingSchema = new mongoose.Schema({
    buying: Number,
    name: String,
    kms: Number,
    brand: String,
    model: String,
    category: String,
    bodyType: String,
    fuelType: String,
    description: String,
    images: [{
        url: String,
        filename: String
    }],
    moreImages: [{
        url: String,
        filename: String
    }],
    price: Number,
    isStatus: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        get: function () {
            return this.createdAt.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        },
        set: function (value) {
            if (typeof value === 'string') {
                const parts = value.split('/');
                this.createdAt = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            } else {
                this.createdAt = value;
            }
        }
    },
    wishListUser: {
        type: [String],
        default: [],
    }
});

const Listing = mongoose.model("Product", listingSchema);

const generateFakeCarData = () => {
    const randomBrand = faker.random.arrayElement(['TATA', 'TVS', 'Honda', 'Hyundai', 'Yamaha', 'Hero', 'Bajaj', 'Royel Enfield', 'Suzuki']);
    const randomBodyType = faker.random.arrayElement(['Motorcycles', 'Scooters', 'Hatchback', 'Sedan', 'SUV', 'Minivan', 'MUV']);
    const randomFuelType = faker.random.arrayElement(['Patrol', 'Diesel', 'CNG', 'EV']);

    return {
        buying: faker.random.number({ min: 2000, max: 2022 }),
        name: faker.vehicle.vehicle(),
        kms: faker.random.number({ min: 0, max: 100000 }),
        brand: randomBrand,
        model: faker.vehicle.model(),
        category: 'Car',
        bodyType: randomBodyType,
        fuelType: randomFuelType,
        description: faker.lorem.paragraph(),
        images: [{
            url: carImageList[Math.floor(Math.random() * carImageList.length)],
            filename: `car-image-${faker.datatype.uuid()}.jpg`,
        }],
        moreImages: Array.from({ length: faker.random.number({ min: 0, max: 4 }) }, (_, index) => ({
            url: carImageList[Math.floor(Math.random() * carImageList.length)],
            filename: `car-image-${faker.datatype.uuid()}-${index + 2}.jpg`,
        })),
        price: faker.random.number({ min: 1000, max: 50000 }),
        isStatus: faker.random.boolean(),
        createdAt: faker.date.past(),
        wishListUser: Array.from({ length: faker.random.number({ min: 0, max: 10 }) }, () => faker.internet.userName()),
    };
};

const generateFakeBikeData = () => {
    const randomBrand = faker.random.arrayElement(['TATA', 'TVS', 'Honda', 'Hyundai', 'Yamaha', 'Hero', 'Bajaj', 'Royel Enfield', 'Suzuki']);
    const randomBodyType = faker.random.arrayElement(['Motorcycles', 'Scooters', 'Hatchback', 'Sedan', 'SUV', 'Minivan', 'MUV']);
    const randomFuelType = faker.random.arrayElement(['Patrol', 'Diesel', 'CNG', 'EV']);

    return {
        buying: faker.random.number({ min: 2000, max: 2022 }),
        name: faker.vehicle.vehicle(),
        kms: faker.random.number({ min: 0, max: 100000 }),
        brand: randomBrand,
        model: faker.vehicle.model(),
        category: 'Bike',
        bodyType: randomBodyType,
        fuelType: randomFuelType,
        description: faker.lorem.paragraph(),
        images: [{
            url: bikeImageList[Math.floor(Math.random() * bikeImageList.length)],
            filename: `bike-image-${faker.datatype.uuid()}.jpg`,
        }],
        moreImages: Array.from({ length: faker.random.number({ min: 0, max: 4 }) }, (_, index) => ({
            url: bikeImageList[Math.floor(Math.random() * bikeImageList.length)],
            filename: `bike-image-${faker.datatype.uuid()}-${index + 2}.jpg`,
        })),
        price: faker.random.number({ min: 1000, max: 50000 }),
        isStatus: faker.random.boolean(),
        createdAt: faker.date.past(),
        wishListUser: Array.from({ length: faker.random.number({ min: 0, max: 10 }) }, () => faker.internet.userName()),
    };
};

const initDb = async () => {
    const fakeCarDataArray = Array.from({ length: 50 }, generateFakeCarData);
    const fakeBikeDataArray = Array.from({ length: 50 }, generateFakeBikeData);

    const allData = fakeCarDataArray.concat(fakeBikeDataArray);

    const batchSize = 10; // Adjust the batch size as needed

    for (let i = 0; i < allData.length; i += batchSize) {
        const batch = allData.slice(i, i + batchSize);
        await Listing.insertMany(batch, {
            timeout: 60000, // Set timeout to 60 seconds
        });
    }

    console.log("Data was initialized");
}


main().then(() => {
    console.log("Connected to DB");
    initDb();
}).catch((err) => console.error(err));


