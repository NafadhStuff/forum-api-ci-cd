/* global describe, it, expect */
const AddedThread = require('../AddedThread');

describe('AddedThread Entities', () => {
  // 1. AddedThread tidak berisi field yang lengkap
  // 2. AddedThread field-field berisi tipe data yang tidak sesuai
  // 3. AddedThread berhasil dan memuat data yang sesuai
  it('should throw error when fields of payload not complete', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ngoding asik gak sih?',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when type of fields not suitable', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ngoding asik gak sih?',
      owner: 123,
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_MATCH_TYPE_FIELD');
  });

  it('should throw error when type of fields not suitable', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'Ngoding asik gak sih?',
      owner: 'user-123',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread).toBeInstanceOf(AddedThread);
    expect(addedThread.id).toEqual(addedThread.id);
    expect(addedThread.title).toEqual(addedThread.title);
    expect(addedThread.owner).toEqual(addedThread.owner);
  });
});
