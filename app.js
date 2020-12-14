if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const User = require('./models/user');
const haikujamsRoutes = require('./routes/haikujams');
const reviewsRoutes = require('./routes/reviews');
const usersRoutes = require('./routes/users')
const passport = require('passport');
const LocalStrategy = require('passport-local');

const MongoStore = require('connect-mongo')(session);


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/haikujam';

//'mongodb://localhost:27017/haikujam'
//process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
    .then(() => {
        console.log("Mongo Connection Open!!!");
    })
    .catch(err => {
        console.log('Mongo Connection Error!!!');
        console.log(err);
    })

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


const store = new MongoStore({
    url: dbUrl,
    secret: process.env.SECRET,
    touchAfter: 24 * 3600
})

store.on("error", (e) => {
    console.log("sesion store error", e);
})
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/haikujams', haikujamsRoutes);
app.use('/haikujams/:id/reviews', reviewsRoutes);
app.use('/', usersRoutes);


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/abouthaikujam', (req, res) => {
    res.render('about');
})
app.get('/', (req, res) => {
    res.redirect('/haikujams');
})


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', { err });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started on PORT 3000!!");
})