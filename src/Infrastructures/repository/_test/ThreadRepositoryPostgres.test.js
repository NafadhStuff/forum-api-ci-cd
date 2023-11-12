/* eslint-disable camelcase */
/* global describe, it, expect, afterEach, afterAll */

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres Postgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('AddThread Function', () => {
    it('should add thread to database', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Ngoding asik gak?',
        body: 'Sepengetahuan saya asik, sih',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      await threadRepository.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'Ngoding asik gak?',
        body: 'Sepengetahuan saya asik, sih',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const threadRepository = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await UsersTableTestHelper.addUser({});
      const addedThread = await threadRepository.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: newThread.title,
        owner: newThread.owner,
      }));
    });
  });

  describe('VerifyThreadId Function', () => {
    it('should not throw NotFoundError when thread id available', async () => {
      // Arrange
      const id_thread = 'thread-12345';
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({ id: id_thread, date: new Date().toISOString() });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId(id_thread)).resolves
        .not.toThrowError(NotFoundError);
    });

    it('should throw NotFoundError when thread id unavailable', async () => {
      // Arrange
      const id_thread = 'thread-12345';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadId(id_thread)).rejects
        .toThrowError(NotFoundError);
    });
  });

  describe('getThreadById Function', () => {
    it('should throw NotFoundError when thread id not valid', async () => {
      // Arrange
      const id_thread = 'thread-12345';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getThreadById(id_thread)).rejects
        .toThrowError(NotFoundError);
    });

    it('should return a thread when thread id is valid', async () => {
      // Arrange
      const date = '2023-11-08T03:17:15.389Z';
      const userThread = {
        id: 'user-123',
        username: 'dicoding',
      };

      const thread = {
        thread_id: 'thread-123',
        title:
        'Ngoding asik?',
        body: 'pengen belajar',
        thread_date: date,
      };
      await UsersTableTestHelper.addUser(userThread);
      await ThreadsTableTestHelper.addThread({ date });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadResult = await threadRepositoryPostgres.getThreadById(thread.thread_id);

      // Assert
      expect(threadResult).toStrictEqual({
        thread_id: thread.thread_id,
        title: thread.title,
        body: thread.body,
        thread_date: new Date(thread.thread_date).toISOString(),
        username: userThread.username,
      });
    });
  });
});
