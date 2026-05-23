const mysql = require("mysql2");

const db = mysql.createConnection({

  host: "localhost",

  port: 3307,

  user: "root",

  password: "",

  database: "fuelshare"

});

db.connect((err)=>{

  if(err){

    console.log("DATABASE ERROR:");

    console.log(err);

  }

  else{

    console.log("MySQL Connected Successfully");

  }

});

module.exports = db;