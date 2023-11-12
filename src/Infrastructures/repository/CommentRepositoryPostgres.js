/* eslint-disable camelcase */
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entitites/AddedComment');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(paylaod) {
    const id = `comment-${this._idGenerator()}`;
    const { id_thread, content, owner } = paylaod;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, id_thread, content, owner, '', date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async verifyCommentId(id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    });

    if (!result.rows.length) {
      throw new NotFoundError('Comment tidak dapat dihapus, id tidak ditemukan');
    }
  }

  async isAuthorized(owner, id) {
    const result = await this._pool.query({
      text: 'SELECT * FROM comments WHERE owner = $1 AND id = $2',
      values: [owner, id],
    });

    if (!result.rows.length) {
      throw new AuthorizationError('Anda tidak berhak menghapus comment ini');
    }
  }

  async getCommentsByIdThread(id_thread) {
    const query = {
      text: `SELECT comments.id as comment_id, comments.date as comment_date, comments.content, comments.is_delete, users.username FROM comments LEFT JOIN users ON users.id = comments.owner WHERE comments.id_thread = $1`,
      values: [id_thread],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
      values: ['deleted', id],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
