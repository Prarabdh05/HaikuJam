const { HaikuSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Haiku = require('./models/haiku');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateHaiku = (req, res, next) => {

    const { error } = HaikuSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join('.')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const haiku = await Haiku.findById(id);
    if (!haiku.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/haikujams/${id}`);
    }
    next();
}