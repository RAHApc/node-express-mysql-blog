const db = require('@database/mysql');

exports.findAll = async (columns = []) => {
    const sqlColumns = columns.length > 0 ? columns.join(',') : '*';
    const [result] = await db.query(`
                                        SELECT ${sqlColumns}
                                            FROM settings
                                            `);
    return result;
}

exports.update = async (updateFields) => {
     Object.keys(updateFields).forEach(setting_name => {
        db.query(`UPDATE settings SET setting_value=? WHERE setting_name=?`,[updateFields[setting_name], setting_name])
    });
}

exports.get = async (key) => {
    const [result] = await db.query(`SELECT setting_value
                                        FROM settings
                                        WHERE setting_name=?
                                        LIMIT 1
                                        `, [key]);
    return result.length > 0 ? result[0].setting_value : null;
}