class AddedComment {
  constructor(payload) {
    const { id, content, owner } = this._verifyPayload(payload);

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { id, content, owner } = payload;

    if (!id || !content || !owner) {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
      throw new Error('ADDED_COMMENT.NOT_CONTAIN_MATCH_TYPE_FIELD');
    }

    return payload;
  }
}

module.exports = AddedComment;
