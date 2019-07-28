const express = require('express');
const path = require('path');
require('dotenv').config();
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


/* ----------------------------------------------- */
/*  Initiliazations */
/* ----------------------------------------------- */
const app = express();
require('./database');
require('./config/passport');

/* --------------------------------------------------------------------------------------- */
/* Settings */
/* --------------------------------------------------------------------------------------- */
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
/* ----------------------------------------------- */
/* // ** // Settings Handlebars */
/* ----------------------------------------------- */
app.engine('.hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs');


/* --------------------------------------------------------------------------------------- */
/* Middelwares */
/* --------------------------------------------------------------------------------------- */

app.use(express.urlencoded({ extendes: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req, res, next) =>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')
    res.locals.user = req.user || null;
    next();
})

/* --------------------------------------------------------------------------------------- */
/* Routes */
/* --------------------------------------------------------------------------------------- */
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


/* ----------------------------------------------- */
/* // Static files */
/* ----------------------------------------------- */
app.use(express.static(path.join(__dirname, 'public')));

/* ------------------------------------ */
/* Server is listenning */
/* ------------------------------------ */
app.listen(app.get('port'), () =>{
    console.log('Servidor corriendo desde el puerto', app.get('port'));
})