console.log("Server File Running...");

const express = require("express");

const mysql = require("mysql2");

const cors = require("cors");

const bodyParser = require("body-parser");

const path = require("path");

const app = express();

/* =========================================
MIDDLEWARE
========================================= */

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

/* =========================================
STATIC FRONTEND
========================================= */

app.use(express.static(".."));

/* =========================================
MYSQL CONNECTION
========================================= */

const db = mysql.createConnection({
  host: "localhost",

  port: 3307,

  user: "root",

  password: "",

  database: "fuelshare",
});

/* =========================================
CONNECT DATABASE
========================================= */

db.connect((err) => {
  if (err) {
    console.log("DATABASE ERROR:");

    console.log(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

/* =========================================
HOME ROUTE
========================================= */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

/* =========================================
REGISTER
========================================= */

app.post("/register", (req, res) => {
  const { fullname, email, password, role } = req.body;

  const sql = "INSERT INTO users(fullname,email,password,role) VALUES(?,?,?,?)";

  db.query(sql, [fullname, email, password, role], (err, result) => {
    if (err) {
      console.log(err);

      res.send("Database Error");
    } else {
      res.send("Registration Successful");
    }
  });
});

/* =========================================
LOGIN
========================================= */
/* =========================================
LOGIN
========================================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);

      res.send(err);
    } else {
      if (result.length > 0) {
        res.json({
          success: true,

          role: result[0].role,

          fullname: result[0].fullname,

          email: result[0].email,
        });
      } else {
        res.json({
          success: false,
        });
      }
    }
  });
});
/* =========================================
SAVE PROFILE
========================================= */

app.post("/save-profile", (req, res) => {
  const {
    fullname,

    email,

    phone,

    age,
  } = req.body;

  /* CHECK EXISTING */

  const checkSql = "SELECT * FROM user_profiles WHERE email=?";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.log(err);

      res.send(err);
    } else {
      /* UPDATE */

      if (result.length > 0) {
        const updateSql = `
          UPDATE user_profiles
          SET fullname=?, phone=?, age=?
          WHERE email=?
        `;

        db.query(
          updateSql,

          [fullname, phone, age, email],

          (err2) => {
            if (err2) {
              console.log(err2);

              res.send(err2);
            } else {
              res.json({
                success: true,
                message: "Profile Updated",
              });
            }
          },
        );
      } else {
        /* INSERT */
        const insertSql = `
          INSERT INTO user_profiles
          (fullname,email,phone,age)
          VALUES(?,?,?,?)
        `;

        db.query(
          insertSql,

          [fullname, email, phone, age],

          (err3) => {
            if (err3) {
              console.log(err3);

              res.send(err3);
            } else {
              res.json({
                success: true,
                message: "Profile Saved",
              });
            }
          },
        );
      }
    }
  });
});
/* =========================================
GET PROFILE
========================================= */

app.get("/get-profile/:email", (req, res) => {
  const email = req.params.email;

  const sql = "SELECT * FROM user_profiles WHERE email=?";

  db.query(sql, [email], (err, result) => {
    if (err) {
      console.log(err);

      res.send(err);
    } else {
      if (result.length > 0) {
        res.json({
          success: true,

          profile: result[0],
        });
      } else {
        res.json({
          success: false,
        });
      }
    }
  });
});

/* =========================================
SERVER
========================================= */

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});
