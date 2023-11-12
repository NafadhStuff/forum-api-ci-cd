/* global describe, it, expect */
const AddedComment = require('../AddedComment');

describe('AddedComment Entities', () => {
  it('should create AddedComment entities correctly', () => {
    // Arrange
    const paylaod = {
      id: 'comment-123',
      content: 'Asik, asalkan paham',
      owner: 'user-123',
    };

    // Action
    const addedComment = new AddedComment(paylaod);

    // Assert
    expect(addedComment).toBeInstanceOf(AddedComment);
    expect(addedComment.id).toEqual(paylaod.id);
    expect(addedComment.content).toEqual(paylaod.content);
    expect(addedComment.owner).toEqual(paylaod.owner);
  });

  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when type of fields not match', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Asik, asalkan ngerti',
      owner: ['user-123'],
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_MATCH_TYPE_FIELD');
  });
});
