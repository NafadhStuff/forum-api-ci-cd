class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { id, owner } = useCasePayload;
    await this._commentRepository.verifyCommentId(id);
    await this._commentRepository.isAuthorized(owner, id);
    await this._commentRepository.deleteComment(id);
  }
}

module.exports = DeleteCommentUseCase;
