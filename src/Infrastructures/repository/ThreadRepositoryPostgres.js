const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(payload) {
    const { title, body, owner } = payload;
    const id = `thread-${this._idGenerator(16)}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO thread VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async verifyThreadId(id) {
    const query = {
      text: 'SELECT id FROM thread WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('id_thread tidak ditemukan');
    }
  }

  // eslint-disable-next-line no-unused-vars
  async getThreadById(id) {
    const query = {
      text: `SELECT thread.id as thread_id, thread.title, thread.body, thread.date as thread_date, users.username FROM thread LEFT JOIN users ON users.id = thread.owner WHERE thread.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Thread tidak ditemukan. Id tidak valid');
    }

    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
