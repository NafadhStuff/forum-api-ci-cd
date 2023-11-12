/* global describe, it, expect */
const NewThread = require('../NewThread');

describe('NewThread Entities', () => {
  // 1. Test ketika data tidak lengkap
  // 2. Test ketika data lengkap, namun tidak sesuai tipe yang ditentukan
  // 3. Test ketika data sudah sesuai
  it('should throw error when payload not contain complete data', () => {
    // Arrange
    const payload = {
      title: 'Ngoding asik gak?',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when type of field not match', () => {
    // Arrange
    const payload = {
      title: 'Ngoding asik gak?',
      body: 123,
      owner: 'user-123',
    };

    // Action & Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_MATCH_TYPE_FIELD');
  });

  it('should create NewThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'Ngoding asik gak?',
      body: 'Sepengalamanku, ngoding itu asik asalkan konsisten, wkwkw',
      owner: 'user-123',
    };

    // Action
    const newThread = new NewThread(payload);

    // Assert
    expect(newThread).toBeInstanceOf(NewThread);
    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
    expect(newThread.owner).toEqual(payload.owner);
  });
});
