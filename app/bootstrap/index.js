const express = require('express');
const {engine} = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const fileUpload = require('express-fileupload');
const sessionStore = require('./session-handlers/mysql')(session);

module.exports = app => {
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));
    app.use(cookieParser());
    app.use(session({
        store: sessionStore,
        secret: 'asq9fdggry5768ujkik799iewt34',
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
        unset: 'destroy'
      }));

    app.use(flash());
    app.use(fileUpload({
      createParentPath: true,
      useTempFiles: true,
    }));
    app.engine('handlebars', engine() );
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, '../views'));
    app.use('/static',express.static(path.join(__dirname, '../../public')));
}