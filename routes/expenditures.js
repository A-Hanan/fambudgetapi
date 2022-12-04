const { response } = require("express");
const express = require("express");
const router = express.Router();
var db = require("../db");

router.get("/", async (req, res) => {
  //   console.log("req", req.body);

  console.log("running route");

  await db
    .select("*")
    .from("expenditures")
    // .where("budgetMonth", "=", monthlyDate)
    .then((data) => {
      if (data[0]) {
        console.log("data expenditure", data[0]);
        res.status(200).json({ expenditures: data });
      } else {
        res.status(200).json({ expenditures: [] });
      }
    })
    .catch((err) => {
      res.status(400).send("Not found");
      console.log(err);
    });
});

router.post("/add", async (req, res) => {
  console.log("req in add", req.body);

  await db.schema.hasTable("expenditures").then(function (exists) {
    if (!exists) {
      return db.schema.createTable("expenditures", function (t) {
        t.increments("id").primary();
        t.string("categoryName", 100);
        t.string("expenditureName", 100);
        t.string("totalCost", 100);
        t.string("dateOfSpending", 100);
        t.string("note", 1000);
        t.string("addedBy", 100);
      });
    }
  });

  db.insert(req.body)
    .into("expenditures")
    .then((response) => {
      // console.log("response", response);
      res.status(200).send(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send("unable to add category");
    });
});

router.post("/delete", (req, res) => {
  db.delete()
    .from("expenditures")
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

module.exports = router;
