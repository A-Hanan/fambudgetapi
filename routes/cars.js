const express = require("express");
const router = express.Router();
var db = require("../db");

router.post("/addcar", async (req, res) => {
  await db.schema.hasTable("cars2").then(function (exists) {
    if (!exists) {
      return db.schema.createTable("cars2", function (t) {
        t.increments("id").primary();
        t.string("model", 100);
        t.string("company", 100);
        t.text("details");
      });
    }
  });
  await db
    .insert({
      model: "model11",
      company: "company11",
      details: "details11",
    })
    .into("cars2")
    .then((response) => {
      console.log("response", response);
      res.status(200).send(response);
    })
    .catch((err) => res.status(400).send(err));
});

module.exports = router;
