import * as path from "https://deno.land/std@0.171.0/path/mod.ts";

export const createNews = async (
  ctx,
  title,
  subtitle,
  article,
  image,
  author
) => {
  const date = new Date();
  await ctx.db.query(
    `INSERT INTO news (title, subtitle, article, image, author, date) VALUES (?, ?, ?, ?, ?, ?);`,
    [title, subtitle, article, image, author, date.toLocaleDateString()]
  );
  return true;
};

export const getNews = async (ctx) => {
  const news = await ctx.db.query(`SELECT * FROM news ORDER BY id DESC;`);
  const sortedNews = news.map((news) => {
    return {
      id: news[0],
      title: news[1],
      subtitle: news[2],
      article: news[3],
      image: news[4] || "images/dfinity-logo.png",
      author: news[5],
      date: news[6],
    };
  });
  return sortedNews;
};

export const getNewsById = async (ctx, id) => {
  const news = await ctx.db.query(`SELECT * FROM news WHERE id = ?;`, [id]);
  if (news.length === 0) return false;
  return {
    id: news[0][0],
    title: news[0][1],
    subtitle: news[0][2],
    article: news[0][3],
    image: news[0][4] || "images/dfinity-logo.png",
    author: news[0][5],
    date: news[0][6],
  };
};

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
  await ctx.db.query(`DELETE FROM votes WHERE comment_id = ?;`, [commentId]);
  await ctx.db.query(`DELETE FROM comments WHERE id = ?;`, [commentId]);
  return true;
};

export const deleteNewsArticle = async (ctx, newsId) => {};

export const editNews = async (
  ctx,
  newsId,
  title,
  subtitle,
  article,
  imageName
) => {
  let newImageName;
  const oldImageName = ctx.db.query(`SELECT image FROM news WHERE id = ?;`, [
    newsId,
  ])[0][0];
  if (imageName) {
    oldImageName &&
      (await Deno.remove(path.join(Deno.cwd(), "assets", oldImageName)));
    newImageName = imageName;
  } else {
    newImageName = oldImageName;
  }
  await ctx.db.query(
    `UPDATE news SET title = ?, subtitle = ?, article = ?, image = ? WHERE id = ?;`,
    [title, subtitle, article, newImageName, newsId]
  );
  return true;
};
