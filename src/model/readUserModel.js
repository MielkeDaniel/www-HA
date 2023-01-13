export const getUser = async (db, username) => {
  let user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (user.length === 0) return false;
  user = {
    username: user[0][0],
    accountType: user[0][2],
    description: user[0][3],
    profilePicture: user[0][4] || "images/standard-pp.png",
  };
  return user;
};

export const getUserPassword = async (db, username) => {
  const user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (user.length === 0) return false;
  return user[0][1];
};

export const userExists = async (db, username) => {
  const user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (user.length === 0) return false;
  return true;
};
