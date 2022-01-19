const authService = require('@services/authService');
const userRoles = require('@models/user/userRoles');

exports.showLogin = (req, res) => {
    res.render('auth/login', {layout: 'auth'});
}

exports.doLogin = async (req, res) => {
    const {email, password} = req.body;
    const user = await authService.login(email, password);
    
    if(!user){
        req.flash('errors', ['ایمیل یا کلمه عبور معتبر نمیباشد.'])
        return res.redirect('/auth/login');
    }
    
    req.session.user = user;

    const pathToRedirect = user.role === userRoles.ADMIN ? '/admin/dashboard' : '/';
    return res.redirect(pathToRedirect);
}

exports.showRegister = (req, res) => {
    res.render('auth/register', {layout: 'auth'});
}

exports.doRegister = async (req, res) => {
    const {email, password, password_confirmation} = req.body; 
    const newUserId = await authService.register(email, password);
    if(!newUserId){
        req.flash('errors',['در حال حاظر امکان ثبت نام شما وجود ندارد.'])
        return res.redirect('/auth/register');
    }

    return res.redirect('/auth/login');
}

exports.logout = async (req, res) => {
    req.session.destroy(error => {
        res.redirect('/auth/login');
    })
}