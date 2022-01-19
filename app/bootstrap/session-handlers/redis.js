const redis = require('redis');

module.exports = session => {
    let RadisStore = require('connect-redis')(session);
    let radisClient = redis.createClient()
    return new RadisStore({client: radisClient});
}