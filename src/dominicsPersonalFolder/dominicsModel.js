export const getDominicsQuote = async (ctx) => {
  const quote = await ctx.db.query(`SELECT * FROM dominicWilliamsHolyQuote;`);
  return quote;
};

export const setDominicsQuote = async (ctx, quote) => {
  await ctx.db.query(`UPDATE dominicWilliamsHolyQuote SET quote = ?;`, [quote]);
  return true;
};
