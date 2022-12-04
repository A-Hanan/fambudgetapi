const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
var db = require("../db");

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("incorrect form submission");
  }
  db.select("email", "password", "name", "usertype")
    .from("users")
    .where("email", "=", email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].password);
      // console.log("isValid", isValid, data);

      if (isValid) {
        res.status(200).json({ userData: data[0] });
      } else {
        res.status(400).send("wrong credentials");
      }
    })
    .catch((err) => res.status(400).send("wrong credentials"));
});

router.post("/register", async (req, res) => {
  const { email, name, password, usertype } = req.body;
  // console.log("req", req.body);

  if (!email || !name || !password || !usertype) {
    return res.status(400).send("incorrect form submission");
  }
  const hash = bcrypt.hashSync(password);

  await db.schema.hasTable("users").then(function (exists) {
    if (!exists) {
      return db.schema.createTable("users", function (t) {
        t.increments("id").primary();
        t.string("name", 100);
        t.string("email", 100);
        t.string("password", 200);
        t.string("usertype", 200);
      });
    }
  });
  await db
    .select("email", "password", "name", "usertype")
    .from("users")
    .where("email", "=", email)
    .then((data) => {
      // console.log("data", data);
      if (data[0]?.email) {
        res.send("Sorry a user with email already exits");
        return;
      } else {
        db.insert({
          name,
          email,
          password: hash,
          usertype,
        })
          .into("users")
          .then((response) => {
            // console.log("response", response);
            res.status(200).send(response);
          })
          .catch((err) => res.status(400).send("unable to register"));
      }
    });
});

module.exports = router;
