import { debug as Debug } from "https://deno.land/x/debug@0.2.0/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const debug = Debug("app:model");

export const createUser = async (db, username, password) => {
  password = await bcrypt.hash(password);
  await db.query(
    `INSERT INTO users (username, password, accountType) VALUES (?, ?, ?);`,
    [username, password, "standard"]
  );
  let user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  user = {
    username: user[0][0],
    password: user[0][1],
    accountType: user[0][2],
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
    password: user[0][1],
    accountType: user[0][2],
  };
  return user;
};

export const userExists = async (db, username) => {
  const user = await db.query(`SELECT * FROM users WHERE username = ?;`, [
    username,
  ]);
  if (user.length === 0) return false;
  return true;
};
