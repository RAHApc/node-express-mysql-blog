const db = require('@database/mysql');
const hashService = require('@services/hashService');

exports.find = async (userID) => {
    const [rows, fields] = await db.query(`
                                        SELECT * 
                                            FROM users 
                                            WHERE id=? LIMIT 1`, [userID]);
    return rows.length > 0 ? rows[0] : false;
}

exports.findAll = async (columns=[]) => {
    const sqlColumns = columns.length > 0 ? columns.join(',') : '*';
    const [result] = await db.query(`
                                        SELECT ${sqlColumns}
                                            FROM users
                                            ORDER BY created_at DESC
                                            `
                                            );
    return result;
}

exports.findByEmail = async (email) => {
    const [result] = await db.query(`
                                        SELECT *
                                            FROM users
                                            WHERE email=?
                                            LIMIT 1
                                            `
                                            ,[email]);
    return result.length === 1 ? result[0] : null;
}

exports.create = async (userData) => {
    const hashedPassword = hashService.hashPassword(userData['password']);
    const updateUserData = {...userData, password:hashedPassword}
    const [result] = await db.query('INSERT INTO users SET ?', [updateUserData]);
    return result.insertId;
}

exports.delete = async (userID) => {
    const [result] = await db.query('DELETE FROM users WHERE id=? LIMIT 1', [userID]);
    return result.affectedRows > 0;
}

exports.update = async (userData, userID) => {
    const [result] = await db.query('UPDATE users SET ? WHERE id=? LIMIT 1', [userData, userID]);
    return result.affectedRows > 0;
}