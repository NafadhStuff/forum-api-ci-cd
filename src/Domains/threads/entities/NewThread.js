class NewThread {
  constructor(payload) {
    const { title, body, owner } = this._verifyPayload(payload);

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { title, body, owner } = payload;

    if (!title || !body || !owner) {
      throw new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof title !== 'string' || typeof body !== 'string' || typeof owner !== 'string') {
      throw new Error('NEW_THREAD.NOT_CONTAIN_MATCH_TYPE_FIELD');
    }

    return payload;
  }
}

module.exports = NewThread;
