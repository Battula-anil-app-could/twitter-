const express = require("express");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json());

let dbPath = path.join(__dirname, "twitterClone.db");
let dataBase = null;
let getDataBaseAndServer = async () => {
  try {
    dataTable = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at port 3000");
    });
  } catch (e) {
    console.log(e.massage);
    process.exit(1);
  }
};
getDataBaseAndServer();

app.post("/register", async (request, response) => {
  let { name, username, password, gender } = request.body;
  let hashPassword = await bcrypt.hash(password, 10);
  let checkQuery = `select * from user where username = '${username}'`;
  let dbUser = await dataTable.get(checkQuery);

  if (dbUser === undefined) {
    if (password.length < 6) {
      response.status(400);
      response.send("Password is too short");
    } else {
      let insertQuery = `insert into 
                                user (name, username, password, gender)
                                VALUES (
                                        '${name}',
                                        '${username}',
                                        '${hashPassword}',
                                        '${gender}',)`;
      await dataTable.run(insertQuery);
      response.send("User created successfully");
    }
  } else {
    response.status(400);
    response.send("User already exists");
  }
});

module.exports = app;
