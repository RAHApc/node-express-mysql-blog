const db = require('@database/mysql');
const commentStatus = require('./commentStatus');

exports.find = async (postID) => {
    const [rows, fields] = await db.query(`
                                        SELECT p.*,u.full_name 
                                            FROM posts p 
                                            JOIN 
                                            users u ON 
                                            p.author_id=u.id
                                            WHERE p.id=? LIMIT 1`, [postID]);
    return rows.length > 0 ? rows[0] : false;
}

exports.findByPostId = async (postID, status=commentStatus.APPROVED) => {
    const [rows, fields] = await db.query(`
                                        SELECT * 
                                            FROM comments
                                            WHERE post_id=?
                                            AND status=?`, [postID, status]);
    return rows;
}

exports.findAll = async () => {
    const [rows, fields] = await db.query(`
                                        SELECT c.*,p.title
                                            FROM comments c
                                            JOIN posts p ON
                                            c.post_id=p.id
                                            ORDER BY c.created_at DESC`);
    return rows;
}

exports.create = async (commentData) => {
    const [result] = await db.query('INSERT INTO comments SET ?', [commentData]);
    return result.insertId;
}

exports.delete = async (commentID) => {
    const [result] = await db.query('DELETE FROM comments WHERE id=? LIMIT 1', [commentID]);
    return result.affectedRows > 0;
}

exports.update = async (postData, postID) => {
    const [result] = await db.query('UPDATE posts SET ? WHERE id=? LIMIT 1', [postData, postID]);
    return result.affectedRows > 0;
}

exports.approve = async (commentID) => {
    const [result] = await db.query(`UPDATE comments SET status=? WHERE id=? LIMIT 1`,[commentStatus.APPROVED, commentID])
    return result.affectedRows > 0;
}

exports.reject = async (commentID) => {
    const [result] = await db.query(`UPDATE comments SET status=? WHERE id=? LIMIT 1`,[commentStatus.REJECTED, commentID])
    return result.affectedRows > 0;
}
