/* global describe, it, expect */
const NewComment = require('../NewComment');

describe('NewComment Entities', () => {
  it('should create NewComment entities correctly', () => {
    // Arrange
    const payload = {
      id_thread: 'thread-123',
      content: 'Asik, Bro, asal paham, wkwkw',
      owner: 'user-123',
    };

    // Action & Assert
    const newComment = new NewComment(payload);
    expect(newComment).toBeInstanceOf(NewComment);
    expect(newComment.id_thread).toEqual(payload.id_thread);
    expect(newComment.content).toEqual(payload.content);
    expect(newComment.owner).toEqual(payload.owner);
  });

  it('should throw error when not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'Asik, Bro, asal paham, wkwkw',
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when type of property not match', () => {
    // Arrange
    const payload = {
      id_thread: 'thread-123',
      content: 'Asik, Bro, asal paham, wkwkw',
      owner: [123],
    };

    // Action & Assert
    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_MATCH_TYPE_FIELD');
  });
});
