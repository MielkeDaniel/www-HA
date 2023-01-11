import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export const createUser = async (db, username, password) => {
  password = await bcrypt.hash(password);
  await db.query(
    `INSERT INTO users (username, password, description, accountType) VALUES (?, ?, ?, ?);`,
    [username, password, "Hi, I´m " + username + "!", "standard"]
  );
  let user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  user = {
    username: user[0][0],
    password: user[0][1],
    description: user[0][2],
    accountType: user[0][3],
  };
  return user;
};

export const getUser = async (db, username) => {
  let user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (user.length === 0) return false;
  user = {
    username: user[0][0],
    accountType: user[0][2],
    description: user[0][3],
    profilePicture: user[0][4],
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

export const changeUsername = async (db, username, newUsername) => {
  await db.query(`UPDATE users SET username = ? WHERE username = ?;`, [
    newUsername,
    username,
  ]);
  return true;
};

export const changeDescription = async (db, user, description) => {
  await db.query(`UPDATE users SET description = ? WHERE username = ?;`, [
    description,
    user,
  ]);
  return true;
};

export const imageUpload = async (db, user, image) => {
  await db.query(`UPDATE users SET profilePicture = ? WHERE username = ?;`, [
    image,
    user,
  ]);
  return true;
};
