import * as path from "https://deno.land/std@0.171.0/path/mod.ts";

export const createNews = async (
  ctx,
  title,
  subtitle,
  article,
  image,
  author,
) => {
  const date = new Date();
  await ctx.db.query(
    `INSERT INTO news (title, subtitle, article, image, author, date) VALUES (?, ?, ?, ?, ?, ?);`,
    [title, subtitle, article, image, author, date.toLocaleDateString()],
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

export const deleteNewsArticle = async (ctx, newsId) => {
  const image = await ctx.db.query(`SELECT image FROM news WHERE id = ?;`, [
    newsId,
  ])[0][0];
  image && (await Deno.remove(path.join(Deno.cwd(), "assets", image)));

  await ctx.db.query(`DELETE FROM news WHERE id = ?;`, [newsId]);
  return true;
};

export const editNews = async (
  ctx,
  newsId,
  title,
  subtitle,
  article,
  imageName,
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
    [title, subtitle, article, newImageName, newsId],
  );
  return true;
};
