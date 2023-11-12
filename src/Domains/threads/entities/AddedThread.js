class AddedThread {
  constructor(payload) {
    const { id, title, owner } = this._verifyPayload(payload);

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, title, owner } = payload;

    if (!id || !title || !owner) {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_THREAD.NOT_CONTAIN_MATCH_TYPE_FIELD');
    }

    return payload;
  }
}

module.exports = AddedThread;
