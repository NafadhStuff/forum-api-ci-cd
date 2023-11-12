const { DBCommentToModelComment, DBThreadToModelThread } = require('../mapper');

/* eslint-disable camelcase */
class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    // eslint-disable-next-line prefer-const
    let thread = await this._threadRepository.getThreadById(useCasePayload.id);
    let comments = await this._commentRepository.getCommentsByIdThread(useCasePayload.id);
    thread = DBThreadToModelThread(thread);
    comments = comments.map(DBCommentToModelComment);
    return { ...thread, comments };
  }
}

module.exports = GetDetailThreadUseCase;
