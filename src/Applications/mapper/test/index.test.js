/* global describe, it, expect */
const { DBThreadToModelThread, DBCommentToModelComment } = require('../index');

describe('Mapping Utilities', () => {
  it('Mapping DBThread to ModelThread', () => {
    // Arrange
    const DBThread = {
      thread_id: 'thread-12345',
      title: 'Ngoding asik?',
      body: 'pengen belajar',
      thread_date: '2023-06-26T15:31:36.514Z',
      username: 'dicoding',
    };

    // Action
    const modelThread = DBThreadToModelThread({ ...DBThread });

    // Assert
    expect(modelThread).toStrictEqual({
      id: 'thread-12345',
      title: 'Ngoding asik?',
      body: 'pengen belajar',
      date: '2023-06-26T15:31:36.514Z',
      username: 'dicoding',
    });
  });

  describe('Mapping DBComment to ModelComment', () => {
    it('when content is deleted', () => {
      // Arrange
      const DBComment = {
        comment_id: 'comment-12345',
        username: 'dicoding',
        comment_date: '2023-06-26T15:31:36.514Z',
        content: 'Ngoding asik?',
        is_delete: 'deleted',
      };

      // Action
      const modelComment = DBCommentToModelComment({ ...DBComment });

      // Assert
      expect(modelComment).toStrictEqual({
        id: 'comment-12345',
        username: 'dicoding',
        date: '2023-06-26T15:31:36.514Z',
        content: '**komentar telah dihapus**',
      });
    });

    it('when content is not deleted', () => {
      // Arrange
      const DBComment = {
        comment_id: 'comment-12345',
        username: 'dicoding',
        comment_date: '2023-06-26T15:31:36.514Z',
        content: 'Ngoding asik?',
        is_delete: '',
      };

      // Action
      const modelComment = DBCommentToModelComment({ ...DBComment });

      // Assert
      expect(modelComment).toStrictEqual({
        id: 'comment-12345',
        username: 'dicoding',
        date: '2023-06-26T15:31:36.514Z',
        content: 'Ngoding asik?',
      });
    });
  });
});
