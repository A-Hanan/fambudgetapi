const db = require("./../db");

db.schema.createTableIfNotExists("modernCars", function (table) {
  table.increments();
  table.string("car 1", 128);
  table.string("car 2", 128);
  table.string("car 3", 128);
  //table.string('email', 128);
  //table.string('role').defaultTo('admin');
  table.timestamps();
});

exports.module = db;
