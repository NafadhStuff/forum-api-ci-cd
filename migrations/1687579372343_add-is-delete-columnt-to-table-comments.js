exports.up = (pgm) => {
  pgm.addColumn('comments', {
    is_delete: {
      type: 'VARCHAR(10)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('comments', 'is_delete');
};
