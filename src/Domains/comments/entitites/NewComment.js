/* eslint-disable camelcase */
class NewComment {
  constructor(payload) {
    const { content, owner, id_thread } = this._verifyPayload(payload);

    this.id_thread = id_thread;
    this.content = content;
    this.owner = owner;
  }

  _verifyPayload(payload) {
    const { content, owner, id_thread } = payload;

    if (!content || !owner || !id_thread) {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof owner !== 'string' || typeof id_thread !== 'string') {
      throw new Error('NEW_COMMENT.NOT_CONTAIN_MATCH_TYPE_FIELD');
    }

    return payload;
  }
}

module.exports = NewComment;
