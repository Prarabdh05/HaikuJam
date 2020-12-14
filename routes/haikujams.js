const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Haiku = require('../models/haiku');
const { isLoggedIn, validateHaiku, isAuthor } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const haikus = await Haiku.find({});
    res.render('haikus/index', { haikus });
}))

router.get('/new', isLoggedIn, catchAsync((req, res) => {
    res.render('haikus/new');
}))
router.post('/', isLoggedIn, validateHaiku, catchAsync(async (req, res, next) => {
    const haiku = new Haiku(req.body.haikujam);
    haiku.author = req.user._id;
    await haiku.save();
    req.flash('success', 'Successfully made a new Haiku');
    res.redirect(`haikujams/${haiku._id}`);

}))
router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const haiku = await Haiku.findById(id).populate('reviews').populate('author');
    if (!haiku) {
        req.flash('error', 'Cannot find that Haiku!');
        return res.redirect('/haikujams');
    }
    console.log(haiku);
    res.render('haikus/show', { haiku });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const haiku = await Haiku.findById(id);
    res.render('haikus/edit', { haiku });
}))

router.put('/:id', isLoggedIn, validateHaiku, catchAsync(async (req, res) => {
    const { id } = req.params;
    const haiku = await Haiku.findByIdAndUpdate(id, { ...req.body.haikujam });
    req.flash('success', 'Successfully updated Haiku');
    res.redirect(`/haikujams/${haiku._id}`);
}))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const haiku = await Haiku.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted Haiku');
    res.redirect(`/haikujams`);
}))


module.exports = router;