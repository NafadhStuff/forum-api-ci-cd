/* global describe, afterAll, afterEach, it, expect */
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and new comment', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id } = responseThreadJson.data.addedThread;

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });

      // Assert
      const responseJson = JSON.parse(responseComment.payload);
      expect(responseComment.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment.id).toBeDefined();
      expect(responseJson.data.addedComment.content).toBeDefined();
      expect(responseJson.data.addedComment.owner).toBeDefined();
    });

    it('should response 401 when user dont attach access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id } = responseThreadJson.data.addedThread;

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        headers: {},
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });

      // Assert
      const responseJson = JSON.parse(responseComment.payload);
      expect(responseComment.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 404 when thread id not found', async () => {
      // Arrange
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const id = 'xxx';

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });

      // Assert
      const responseJson = JSON.parse(responseComment.payload);
      expect(responseComment.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('id_thread tidak ditemukan');
    });

    it('should response 400 when not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id } = responseThreadJson.data.addedThread;

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(responseComment.payload);
      expect(responseComment.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('harus mengirimkan content');
    });

    it('should response 400 when type of field not match', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });

      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id } = responseThreadJson.data.addedThread;

      // Action
      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${id}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: ['Asik banget'],
        },
      });

      // Assert
      const responseJson = JSON.parse(responseComment.payload);
      expect(responseComment.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('content harus string');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 200 and delete comment', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: idThread } = responseThreadJson.data.addedThread;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const { id: idComment } = responseCommentJson.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when user not attach access token', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: idThread } = responseThreadJson.data.addedThread;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const { id: idComment } = responseCommentJson.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 403 when not the owner ', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add 2 user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'newdicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthenticationDicoding = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });
      const responseAuthenticationNewDicoding = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'newdicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJsonDicoding = JSON.parse(responseAuthenticationDicoding.payload);
      const responseAuthenticationJsonNewDicoding = JSON
        .parse(responseAuthenticationNewDicoding.payload);
      const { accessToken: accessTokenDicoding } = responseAuthenticationJsonDicoding.data;
      const { accessToken: accessTokenNewDicoding } = responseAuthenticationJsonNewDicoding.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessTokenDicoding}`,
        },
        payload: requestPayload,
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: idThread } = responseThreadJson.data.addedThread;

      const responseComment = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        headers: {
          Authorization: `Bearer ${accessTokenDicoding}`,
        },
        payload: {
          content: 'Ngoding asik, Bro',
        },
      });
      const responseCommentJson = JSON.parse(responseComment.payload);
      const { id: idComment } = responseCommentJson.data.addedComment;

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
        headers: {
          Authorization: `Bearer ${accessTokenNewDicoding}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.message).toEqual('Anda tidak berhak menghapus comment ini');
    });

    it('should response 404 when id not found ', async () => {
      // Arrange
      const requestPayload = {
        title: 'ngoding asik, ya?',
        body: 'Sepengalamanku asik',
      };
      const server = await createServer(container);
      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // Login dengan user yang terdaftar
      const responseAuthentication = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding',
          password: 'secret',
        },
      });

      const responseAuthenticationJson = JSON.parse(responseAuthentication.payload);
      const { accessToken } = responseAuthenticationJson.data;

      const responseThread = await server.inject({
        method: 'POST',
        url: '/threads',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        payload: requestPayload,
      });
      const responseThreadJson = JSON.parse(responseThread.payload);
      const { id: idThread } = responseThreadJson.data.addedThread;

      const idComment = 'xxxx';

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.message).toEqual('Comment tidak dapat dihapus, id tidak ditemukan');
    });
  });
});
