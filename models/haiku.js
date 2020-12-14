const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');
const HaikuSchema = new Schema({
    title: String,
    description: String,
    location: String,
    author:
    {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

HaikuSchema.post('findOneAndDelete', async function (haiku) {
    if (haiku) {
        await Review.deleteMany({
            _id: { $in: haiku.reviews }
        })
    }
})

module.exports = mongoose.model('Haiku', HaikuSchema);