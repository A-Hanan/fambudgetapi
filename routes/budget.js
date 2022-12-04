const { response } = require("express");
const express = require("express");
const router = express.Router();
var db = require("../db");

router.post("/getByDate", async (req, res) => {
  //   console.log("req", req.body);
  const { monthlyDate } = req.body;
//   console.log("running route");

  await db
    .select("budgetAmount", "budgetMonth", "addedBy")
    .from("monthlybudgets")
    .where("budgetMonth", "=", monthlyDate)
    .then((data) => {
      if (data[0]) {
        // console.log("data", data[0]);
        res.status(200).json({ budgetData: data[0] });
      } else {
        res.status(200).json({ budgetData: {} });
      }
    })
    .catch((err) => {
      res.status(400).send("Not found");
      console.log(err);
    });
});

router.post("/add", async (req, res) => {
  console.log("req in add", req.body);

  await db.schema.hasTable("monthlybudgets").then(function (exists) {
    if (!exists) {
      return db.schema.createTable("monthlybudgets", function (t) {
        t.increments("id").primary();
        t.string("budgetAmount", 100);
        t.string("budgetMonth", 100);
        t.string("addedBy", 200);
      });
    }
  });

  /***update if already exist for current Month */
  await db
    .select("id", "budgetAmount", "budgetMonth", "addedBy")
    .from("monthlybudgets")
    .where("budgetMonth", "=", req.body?.budgetMonth)
    .then((data) => {
      if (data[0]) {
        // console.log("data", data[0]);
        //update logic

        db.update({ budgetAmount: req.body?.budgetAmount })
          .into("monthlybudgets")
          .where("budgetMonth", "=", req.body?.budgetMonth)
          .then((res2) => {
            console.log("response 2", res2);
            res.status(200).send("successfully Updated");
          })
          .catch((e) => {
            console.log(e);
            res.status(400).json(e);
          });
      } else {
        db.insert(req.body)
          .into("monthlybudgets")
          .then((response) => {
            // console.log("response", response);
            res.status(200).send(response);
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send("unable to add budget");
          });
      }
    })
    .catch((err) => {
      res.status(500).send("internal server error");
      console.log(err);
    });
});

module.exports = router;
