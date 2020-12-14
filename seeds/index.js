const mongoose = require('mongoose');
const Haiku = require('../models/haiku');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/haikujam', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Mongo Connection Open!!!");
    })
    .catch(err => {
        console.log('Mongo Connection Error!!!');
        console.log(err);
    })

const sample = arr => arr[Math.floor(Math.random() * arr.length)];
const seedDB = async () => {
    await Haiku.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const haiku = new Haiku({

            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, labore cupiditate atque ratione repudiandae beatae eius at, ullam praesentium aut, odit explicabo consectetur. Doloribus ipsa molestias enim. Iusto, recusandae ducimus.!'
        });

        await haiku.save();
    }
}
seedDB()
    .then(() => {
        mongoose.connection.close();
    })