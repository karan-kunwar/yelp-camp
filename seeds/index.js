const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
mongoose.set('strictQuery', false);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image:  'https://source.unsplash.com/random/?camping',
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, eos neque, consequuntur vel corporis esse asperiores dignissimos at tempore perferendis laudantium aspernatur culpa incidunt maiores quia corrupti nostrum, aliquam pariatur. Aliquid reprehenderit fuga ipsa ipsam optio, laborum fugiat laudantium sunt doloremque harum sint at deserunt porro vel veniam esse incidunt exercitationem beatae? Doloribus ullam temporibus perferendis aliquam quia eligendi iure.',
            price: 1000
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})