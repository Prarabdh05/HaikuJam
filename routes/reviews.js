const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Haiku = require('../models/haiku');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schemas');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const haiku = await Haiku.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/haikujams/${id}`);
}))

router.post('/', validateReview, catchAsync(async (req, res) => {
    const haiku = await Haiku.findById(req.params.id);
    const review = new Review(req.body.review);
    haiku.reviews.push(review);
    await review.save();
    await haiku.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/haikujams/${haiku._id}`);
}))

module.exports = router;

