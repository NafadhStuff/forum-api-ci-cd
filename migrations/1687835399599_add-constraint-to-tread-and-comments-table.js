exports.up = (pgm) => {
  pgm.addConstraint('thread', 'fk_thread.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('comments', 'fk_comments.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  pgm.addConstraint('comments', 'fk_comments.id_thread_thread.id', 'FOREIGN KEY(id_thread) REFERENCES thread(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('thread', 'fk_thread.owner_users.id');

  pgm.dropConstraint('comments', 'fk_comments.owner_users.id');

  pgm.dropConstraint('comments', 'fk_comments.id_thread_thread.id');
};
