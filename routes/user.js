const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt-nodejs");
var db = require("../db");

router.get("/allRegularUsers", (req, res) => {
  console.log("running");
  db.select("id", "email", "name", "usertype")
    .from("users")
    .where("usertype", "=", "regularUser")
    .then((data) => {
      console.log("all regular users", data);
      res.status(200).json(data);
    })
    .catch((err) => res.status(500).send(err));
});
router.post("/deleteUser", (req, res) => {
  console.log("req", req.body);
  db.delete()
    .from("users")
    .where("id", "=", req.body?.id)
    .then((res2) => {
      console.log("response 2", res2);
      res.status(200).send("successfully deleted");
    })
    .catch((e) => {
      console.log(e);
      res.status(400).json(e);
    });
});
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
