const userModel = require('@models/user');
const hashService = require('@services/hashService');
const userRoles = require('@models/user/userRoles');

exports.login = async (email, plainPassword) => {
    const user = await userModel.findByEmail(email);
    if (!user) {
        return false;
    }

    const {
        password
    } = user;
    return hashService.comparePassword(plainPassword, password) ? user : false;
}

exports.register = async (email, password) => {
    const insertID = await userModel.create({
        full_name: 'کاربر ناشناس',
        email,
        password,
        role:userRoles.USER
    });

    return insertID;
}