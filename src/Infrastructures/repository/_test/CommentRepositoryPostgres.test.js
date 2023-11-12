/* global describe, it, expect, afterEach, afterAll */
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const AddedComment = require('../../../Domains/comments/entitites/AddedComment');
const NewComment = require('../../../Domains/comments/entitites/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('CommentRepository Postgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('AddComment Function', () => {
    it('should add comment to database', async () => {
      // Arrange
      const newComment = new NewComment({
        id_thread: 'thread-123',
        content: 'Asik, asal ngerti',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await commentRepositoryPostgres.addComment({ ...newComment, date: new Date().toISOString() });
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');

      // Assert
      expect(comment).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        id_thread: 'thread-123',
        content: 'Asik, asal ngerti',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      const addedComment = await commentRepositoryPostgres
        .addComment({ ...newComment, date: new Date().toISOString() });

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'Asik, asal ngerti',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyCommentId', () => {
    it('should not throw NotFoundError when id valid', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await CommentsTableTestHelper.addComment({ date: new Date().toISOString() });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId(payload.id)).resolves.not
        .toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when id not valid', async () => {
      // Arrange
      const payload = {
        id: 'comment-1234',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await CommentsTableTestHelper.addComment({ date: new Date().toISOString() });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentId(payload.id)).rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('isAuthorized Function', () => {
    it('should not throw AuthorizationError when owner valid', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await CommentsTableTestHelper.addComment({ date: new Date().toISOString() });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.isAuthorized(payload.owner, payload.id)).resolves.not
        .toThrowError(AuthorizationError);
    });

    it('should throw AuthorizationError when owner not valid', async () => {
      // Arrange
      const payload = {
        id: 'comment-123',
        owner: 'user-1234',
      };
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await CommentsTableTestHelper.addComment({ date: new Date().toISOString() });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.isAuthorized(payload.owner, payload.id)).rejects
        .toThrowError(AuthorizationError);
    });
  });

  describe('DeleteComment Function', () => {
    it('should delete comment when id and owner true', async () => {
      // Arrange
      const date = new Date().toISOString();
      const payload = {
        id: 'comment-123',
        owner: 'user-123',
      };

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      // Nilai is_delete di sini adalah ''
      await CommentsTableTestHelper.addComment({ date });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepository.deleteComment(payload.id);

      // Assert
      // eslint-disable-next-line camelcase
      const { id, is_delete } = await CommentsTableTestHelper.verifyIsDeleteById(payload.id);
      expect(id).toEqual(payload.id);
      expect(is_delete).toEqual('deleted');
    });
  });

  describe('getCommentsByIdThread Function', () => {
    it('should get comments when id_thread valid', async () => {
      // Arrange
      const payload = {
        id_thread: 'thread-123',
      };

      const date = new Date().toISOString();

      const comments = [
        {
          comment_id: 'comment-123',
          content: 'Asik, asal paham',
          username: 'dicoding',
          comment_date: date,
          is_delete: '',
        },
      ];

      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ date: new Date().toISOString() });
      await CommentsTableTestHelper.addComment({ date });
      const commentRepository = new CommentRepositoryPostgres(pool, {});

      // Action
      const result = await commentRepository.getCommentsByIdThread(payload.id_thread);

      // Assert
      expect(result).toEqual(comments);
    });
  });
});
