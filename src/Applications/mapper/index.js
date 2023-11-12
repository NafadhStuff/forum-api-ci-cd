/* eslint-disable camelcase */
const DBThreadToModelThread = ({
  thread_id,
  title,
  body,
  thread_date,
  username,
}) => ({
  id: thread_id,
  title,
  body,
  date: thread_date,
  username,
});

const DBCommentToModelComment = ({
  comment_id,
  username,
  comment_date,
  content,
  is_delete,
}) => ({
  id: comment_id,
  username,
  date: comment_date,
  content: is_delete === '' ? content : '**komentar telah dihapus**',
});

module.exports = { DBThreadToModelThread, DBCommentToModelComment };
