const settingModel = require('@models/setting');
// const dateService = require('@services/dateService');
// const langService = require('@services/langService');

exports.index = async (req, res) => {
    const settings = await settingModel.findAll();
    const presentedSettings = {}
    settings.forEach((item) => {
        presentedSettings[item.setting_name] = item.setting_value;
    })
    
    res.adminRender('admin/settings/index', {
        presentedSettings,
        helpers:{
            isChecked:function(value, options){
                return parseInt(value) === 1 ? options.fn(this) : options.inverse(this);
            }
        }
    })
}

exports.store = async (req, res) => {
    const settings = req.body;
    const validatedSetting = {};
    Object.keys(settings).forEach(setting_name => {
        if (settings[setting_name] === 'on') {
            validatedSetting[setting_name] = 1;
        } else {
            validatedSetting[setting_name] = settings[setting_name];
        }
    })
    const insertId = await settingModel.update(validatedSetting);
    res.redirect('/admin/settings');
}

