const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signIn = require("./controllers/signIn");

//biggest and most common error happens when we forget to use body parser

const db = knex({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "example", //maybe test
    database: "cars",
  },
});

// db.schema
//   .createTable("cars", (table) => {
//     table.increments("id");
//     table.string("name");
//     table.integer("price");
//   })
//   .then(() => console.log("table created"))
//   .catch((err) => {
//     console.log(err);
//     throw err;
//   })
//   .finally(() => {
//     db.destroy();
//   });

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

const userRoute = require("./routes/user");
app.use("/api/user", userRoute);

const budgetRoute = require("./routes/budget");
app.use("/api/budget", budgetRoute);

const categoriesRoute = require("./routes/categories");
app.use("/api/categories", categoriesRoute);

const expendituresRoute = require("./routes/expenditures");
app.use("/api/expenditures", expendituresRoute);

const carRoute = require("./routes/cars");
app.use("/api/cars", carRoute);

// app.post("/signin", (req, res) => {
//   signIn.handleSignIn(req, res, db, bcrypt);
// });

// app.post("/register", (req, res) => {
//   register.handleRegister(req, res, db, bcrypt);
// });

//when we such syntax use below like /:id it mean we can write anything
//at this place in yrl like /profile/33234

// app.get("/profile/:id", (req, res) => {
//   profile.handleProfileGET(req, res, db);
// });

// app.put("/image", (req, res) => {
//   image.handleImage(req, res, db);
// });

// app.post("/imageurl", (req, res) => {
//   image.handleApiCall(req, res);
// });

app.listen(5000, () => {
  console.log("app is running on port 500");
});

/*
*** slight idea of what we wanna made and about routes

/  --> res = this  is working
/signin  --> POST = success / failure
/register  --> POST = user
/profile/:userId  --> GET = user
/image (rank) --> PUT = user

*/
