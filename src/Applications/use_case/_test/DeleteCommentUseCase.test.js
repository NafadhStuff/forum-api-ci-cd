/* global describe, it, expect, jest */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    const mockCommentRepository = new CommentRepository();

    // Mocking
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.isAuthorized = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await deleteCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.deleteComment)
      .toBeCalledWith(useCasePayload.id);
    expect(mockCommentRepository.isAuthorized)
      .toBeCalledWith(useCasePayload.owner, useCasePayload.id);
    expect(mockCommentRepository.verifyCommentId)
      .toBeCalledWith(useCasePayload.id);
  });
});
