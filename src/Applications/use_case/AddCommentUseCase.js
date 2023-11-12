/* eslint-disable camelcase */
const NewComment = require('../../Domains/comments/entitites/NewComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  // eslint-disable-next-line consistent-return
  async execute(useCasePayload) {
    const { content, owner, id_thread } = new NewComment(useCasePayload);
    await this._threadRepository.verifyThreadId(id_thread);
    return this._commentRepository.addComment({ content, owner, id_thread });
  }
}

module.exports = AddCommentUseCase;
