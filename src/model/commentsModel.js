export const comment = async (ctx, newsId, comment, profilePicture) => {
  const date = new Date();
  await ctx.db.query(
    `INSERT INTO comments (author, article_id, comment, upvotes, downvotes, date, profilepicture) VALUES (?, ?, ?, ?, ?, ?, ?);`,
    [ctx.user, newsId, comment, 0, 0, date.toLocaleDateString(), profilePicture]
  );
  return true;
};

export const getComments = async (ctx, newsId) => {
  const comments = await ctx.db.query(
    `SELECT * FROM comments WHERE article_id = ?;`,
    [newsId]
  );
  const sortedComments = comments
    .map((comment) => {
      return {
        id: comment[0],
        author: comment[1],
        article_id: comment[2],
        comment: comment[3],
        upvotes: comment[4],
        downvotes: comment[5],
        date: comment[6],
        profilePicture: comment[7],
      };
    })
    .reverse();
  return sortedComments;
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