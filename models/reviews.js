const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reveiewSchema = new Schema({
    body: String,
    rating: Number
})

module.exports = mongoose.model('Review', reveiewSchema);