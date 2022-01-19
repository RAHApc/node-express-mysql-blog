const db = require('@database/mysql');

exports.find = async (postID) => {
    const [rows, fields] = await db.query(`
                                        SELECT p.*,u.full_name 
                                            FROM posts p 
                                            LEFT JOIN 
                                            users u ON 
                                            p.author_id=u.id
                                            WHERE p.id=? LIMIT 1`, [postID]);
    return rows.length > 0 ? rows[0] : false;
}

exports.findBySlug = async (postSlug) => {
    const [rows, fields] = await db.query(`
                                        SELECT *
                                            FROM posts
                                            WHERE slug=? LIMIT 1`, [postSlug]);
    return rows.length > 0 ? rows[0] : false;
}

exports.findByKeyword = async (keyword) => {
    const [rows, fields] = await db.query(`
                                        SELECT p.*,u.full_name 
                                            FROM posts p 
                                            LEFT JOIN 
                                            users u ON 
                                            p.author_id=u.id
                                            WHERE p.title LIKE ?
                                            ORDER BY p.created_at DESC`, ['%'+keyword+'%']);
    return rows;
}

exports.latestPosts = async (count=10) => {
    const [rows, fields] = await db.query(`
                                            SELECT p.*,u.full_name 
                                                FROM posts p 
                                                LEFT JOIN 
                                                users u ON 
                                                p.author_id=u.id
                                                ORDER BY p.created_at DESC
                                                LIMIT ${count}`);
    return rows;
}

exports.findAll = async (page=1, perpage=10) => {
    const offset = (page - 1) * perpage;

    const [rows, fields] = await db.query(`
                                        SELECT p.*,u.full_name 
                                            FROM posts p 
                                            LEFT JOIN 
                                            users u ON 
                                            p.author_id=u.id
                                            ORDER BY p.created_at DESC
                                            LIMIT ${offset}, ${perpage}
                                            `);
    return rows;
}

exports.count = async () => {
    const [rows, fields] = await db.query(`
                                        SELECT COUNT(id) as postCount
                                            FROM posts`);
    return rows[0].postCount;
}

exports.create = async (postData) => {
    const [result] = await db.query('INSERT INTO posts SET ?', [postData]);
    return result.insertId;
}

exports.delete = async (postID) => {
    const [result] = await db.query('DELETE FROM posts WHERE id=? LIMIT 1', [postID]);
    return result.affectedRows > 0;
}

exports.update = async (postData, postID) => {
    const [result] = await db.query('UPDATE posts SET ? WHERE id=? LIMIT 1', [postData, postID]);
    return result.affectedRows > 0;
}
