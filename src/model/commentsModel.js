import { changeUsername } from "./changeUserModel.js";

export const comment = async (ctx, newsId, comment, profilePicture) => {
  const date = new Date();
  await ctx.db.query(
    `INSERT INTO comments (author, article_id, comment, upvotes, downvotes, date, profilepicture) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [
      ctx.user.username,
      newsId,
      comment,
      0,
      0,
      date.toLocaleDateString(),
      profilePicture,
    ]
  );
  return true;
};

export const getReplies = async (ctx, commentId) => {
  const replies = await ctx.db.query(
    `SELECT * FROM replies WHERE comment_id = ?;`,
    [commentId]
  );
  const sortedReplies = replies
    .map((reply) => {
      return {
        comment_id: reply[0],
        author: reply[1],
        profilePicture: reply[2],
        date: reply[3],
        reply: reply[4],
        id: reply[5],
      };
    })
    .reverse();
  return sortedReplies;
};

export const getReply = async (ctx, replyId) => {
  const reply = await ctx.db.query(`SELECT * FROM replies WHERE id = ?;`, [
    replyId,
  ]);
  return reply;
};

export const deleteReply = async (ctx, replyId) => {
  await ctx.db.query(`DELETE FROM replies WHERE id = ?;`, [replyId]);
  return true;
};

export const getComments = async (ctx, newsId) => {
  const comments = await ctx.db.query(
    `SELECT * FROM comments WHERE article_id = ?;`,
    [newsId]
  );
  let sortedComments = comments
    .map(async (comment) => {
      return {
        id: comment[0],
        author: comment[1],
        article_id: comment[2],
        comment: comment[3],
        upvotes: comment[4],
        downvotes: comment[5],
        date: comment[6],
        profilePicture: comment[7],
        replies: await getReplies(ctx, comment[0]),
      };
    })
    .reverse();
  sortedComments = await Promise.all(sortedComments);
  return sortedComments;
};

export const getComment = async (ctx, commentId) => {
  const comment = await ctx.db.query(`SELECT * FROM comments WHERE id = ?;`, [
    commentId,
  ]);
  return comment;
};

export const upvoteComment = async (ctx, commentId) => {
  const votedComment = await ctx.db.query(
    `SELECT * FROM votes WHERE user_id = ? AND comment_id = ?;`,
    [ctx.user, commentId]
  );
  if (votedComment.length > 0 && votedComment[0][3] === "upvote") {
    await ctx.db.query(
      `DELETE FROM votes WHERE user_id = ? AND comment_id = ?;`,
      [ctx.user, commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET upvotes = upvotes - 1 WHERE id = ?;`,
      [commentId]
    );
    return true;
  } else if (votedComment.length > 0 && votedComment[0][3] === "downvote") {
    await ctx.db.query(
      `UPDATE votes SET vote = 'upvote' WHERE user_id = ? AND comment_id = ?;`,
      [ctx.user, commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?;`,
      [commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET downvotes = downvotes - 1 WHERE id = ?;`,
      [commentId]
    );
    return true;
  }
  await ctx.db.query(
    `INSERT INTO votes (user_id, comment_id, vote) VALUES (?, ?, ?);`,
    [ctx.user, commentId, "upvote"]
  );
  await ctx.db.query(
    `UPDATE comments SET upvotes = upvotes + 1 WHERE id = ?;`,
    [commentId]
  );
  return true;
};

export const downvoteComment = async (ctx, commentId) => {
  const votedComment = await ctx.db.query(
    `SELECT * FROM votes WHERE user_id = ? AND comment_id = ?;`,
    [ctx.user, commentId]
  );
  if (votedComment.length > 0 && votedComment[0][3] === "downvote") {
    await ctx.db.query(
      `DELETE FROM votes WHERE user_id = ? AND comment_id = ?;`,
      [ctx.user, commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET downvotes = downvotes - 1 WHERE id = ?;`,
      [commentId]
    );
    return true;
  } else if (votedComment.length > 0 && votedComment[0][3] === "upvote") {
    await ctx.db.query(
      `UPDATE votes SET vote = 'downvote' WHERE user_id = ? AND comment_id = ?;`,
      [ctx.user, commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET upvotes = upvotes - 1 WHERE id = ?;`,
      [commentId]
    );
    await ctx.db.query(
      `UPDATE comments SET downvotes = downvotes + 1 WHERE id = ?;`,
      [commentId]
    );
    return true;
  }
  await ctx.db.query(
    `INSERT INTO votes (user_id, comment_id, vote) VALUES (?, ?, ?);`,
    [ctx.user, commentId, "downvote"]
  );
  await ctx.db.query(
    `UPDATE comments SET downvotes = downvotes + 1 WHERE id = ?;`,
    [commentId]
  );
  return true;
};

export const deleteComment = async (ctx, commentId) => {
  await ctx.db.query(`DELETE FROM comments WHERE id = ?;`, [commentId]);
  return true;
};

export const reply = async (
  ctx,
  commentId,
  username,
  reply,
  profilePicture
) => {
  const date = new Date();
  await ctx.db.query(
    `INSERT INTO replies (comment_id, author, reply, date, profilePicture) VALUES (?, ?, ?, ?, ?);`,
    [commentId, username, reply, date.toLocaleDateString(), profilePicture]
  );
  return true;
};
