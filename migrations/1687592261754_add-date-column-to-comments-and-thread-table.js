exports.up = (pgm) => {
  pgm.addColumn('thread', {
    date: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp')
    }
  });

  pgm.addColumn('comments', {
    date: {
      type: 'TEXT',
      notNull: true,
      default: pgm.func('current_timestamp')
  }
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('thread', 'date');
  pgm.dropColumn('comments', 'date');
};
