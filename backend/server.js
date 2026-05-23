require("dotenv").config();

console.log("Server File Running...");

/* =========================================
IMPORTS
========================================= */

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

/* =========================================
APP
========================================= */

const app = express();

/* =========================================
MIDDLEWARE
========================================= */

app.use(cors());

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

/* =========================================
STATIC FRONTEND
========================================= */

app.use(express.static(path.join(__dirname, "..")));

/* =========================================
MYSQL CONNECTION
========================================= */

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

/* =========================================
CONNECT DATABASE
========================================= */

db.connect((err) => {
  if (err) {
    console.log("DATABASE CONNECTION ERROR:");
    console.log(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

/* =========================================
HOME ROUTE
========================================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
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

      res.status(500).send("Database Error");
    } else {
      res.json({
        success: true,
        message: "Registration Successful",
      });
    }
  });
});

/* =========================================
LOGIN
========================================= */

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);

      res.status(500).send(err);
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
          message: "Invalid Email or Password",
        });
      }
    }
  });
});

/* =========================================
SAVE PROFILE
========================================= */

app.post("/save-profile", (req, res) => {
  const { fullname, email, phone, age } = req.body;

  const checkSql = "SELECT * FROM user_profiles WHERE email=?";

  db.query(checkSql, [email], (err, result) => {
    if (err) {
      console.log(err);

      res.status(500).send(err);
    } else {
      if (result.length > 0) {
        const updateSql = `
          UPDATE user_profiles
          SET fullname=?, phone=?, age=?
          WHERE email=?
        `;

        db.query(updateSql, [fullname, phone, age, email], (err2, result2) => {
          if (err2) {
            console.log(err2);

            res.status(500).send(err2);
          } else {
            res.json({
              success: true,
              message: "Profile Updated Successfully",
            });
          }
        });
      } else {
        const insertSql = `
          INSERT INTO user_profiles
          (fullname,email,phone,age)
          VALUES(?,?,?,?)
        `;

        db.query(insertSql, [fullname, email, phone, age], (err3, result3) => {
          if (err3) {
            console.log(err3);

            res.status(500).send(err3);
          } else {
            res.json({
              success: true,
              message: "Profile Saved Successfully",
            });
          }
        });
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

      res.status(500).send(err);
    } else {
      if (result.length > 0) {
        res.json({
          success: true,
          profile: result[0],
        });
      } else {
        res.json({
          success: false,
          message: "Profile Not Found",
        });
      }
    }
  });
});

/* =========================================
SERVER
========================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
