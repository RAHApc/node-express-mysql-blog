const userModel = require('@models/user');
const dateService = require('@services/dateService');
const langService = require('@services/langService');

exports.index = async (req, res) => {
    const users = await userModel.findAll();
    const presentedPosts = users.map(user => {
        user.jalali_created_at = langService.toPersianNumber(dateService.toPersianDate(user.created_at));
        return user;
    })
    res.adminRender('admin/users/index', {
        users:presentedPosts
    })
}

exports.create = async (req, res) => {
    res.adminRender('admin/users/new');
}

exports.store = async (req, res) => {
    const userData = {
        full_name: req.body.full_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    }

    const insertId = await userModel.create(userData);
    if (insertId) {
        res.redirect('/admin/users');
    }
}

exports.remove = async (req, res) => {
    const userID = req.params.userID;
    if (parseInt(userID) === 0) {
        res.redirect('/admin/users');
    }
    const result = await userModel.delete(userID);
    res.redirect('/admin/users');
}

exports.edit = async (req, res) => {
    const userID = req.params.userID;
    if (parseInt(userID) === 0) {
        res.redirect('/admin/users');
    }
    const user = await userModel.find(userID);
    res.adminRender('admin/users/edit', {
        user,
        helpers:{
            isUserRole: function(role, options){
                return user.role === role ? options.fn(this) : options.inverse(this)
            }
        }
    });
}

exports.update = async (req, res) => {
    const userID = req.params.userID;
    if (parseInt(userID) === 0) {
        res.redirect('/admin/users');
    }
    
   const result = await userModel.update(req.body, userID);
  return res.redirect('/admin/users');
}