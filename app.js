const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

const dbPath = path.join(__dirname, "userData.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Db Error:${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

app.post("/register", async (request, response) => {
  const { username, name, password, gender, location } = request.body;
  if (password.lenght <= 5) {
    response.status = 400;
    response.send("Password is too short");
  } else {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);
    const selectUserQuery = `SELECT * FROM user WHERE username = ${username};`;
    const dbUser = await db.get(selectUserQuery);
    if (adUser === undefined) {
      const registerUserQuery = `INSERT INTO user(username,name,password,gender,
        location) VALUES(${username},${name},${password},${gender},${location});`;
      await db.run(registerUserQuery);
      response.send("Successful registration of the registrant");
    } else {
      response.status = 400;
      response.send("User already exists");
    }
  }
});
