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
  const news = await ctx.db.query(`SELECT * FROM news;`);
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
