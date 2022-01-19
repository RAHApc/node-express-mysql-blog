const adminRouters = require('./admin');
const authRouters = require('./auth');
const frontRouters = require('./front');

const authMiddleware = require('@middlewares/auth');
const guestMiddleware = require('@middlewares/guest');
const adminMiddleware = require('@middlewares/admin');

const authController = require('@controllers/auth')

module.exports = app => {
    app.use(frontRouters);
    app.use('/admin', [authMiddleware, adminMiddleware], adminRouters);
    app.use('/auth', [guestMiddleware], authRouters);
    app.get('/logout', authController.logout);
}