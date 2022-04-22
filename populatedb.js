#! /usr/bin/env node

console.log(
  "This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require("async");
var Item = require("./models/item");
var Category = require("./models/category");

var mongoose = require("mongoose");
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var items = [];
var categories = [];

function itemCreate(name, desc, numberStock, price, category, cb) {
  itemdetail = {
    name: name,
    numberStock: numberStock,
    price: price,
    category: category,
  };
  if (desc != null) itemdetail.desc = desc;

  var item = new Item(itemdetail);

  item.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Item: " + item);
    items.push(item);
    cb(null, item);
  });
}

function categoryCreate(name, desc, cb) {
  categorydetail = { name: name };
  if (desc != null) categorydetail.desc = desc;

  var category = new Category(categorydetail);

  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategory(cb) {
  async.series(
    [
      function (callback) {
        categoryCreate("T-Shirt", "Summer time!", callback);
      },
      function (callback) {
        categoryCreate("Jeans", "Black , blue ALL JEANS HERE!", callback);
      },
      function (callback) {
        categoryCreate("Boots", "Rain Boots", callback);
      },
    ],
    // optional callback
    cb
  );
}

function createItem(cb) {
  async.series(
    [
      function (callback) {
        itemCreate("Black T-Shirt", "Black T-Shirt", 4, 200, categories[0], callback);
      },
      function (callback) {
        itemCreate("Blue Jean", "Blue Jean", 4, 400, categories[1], callback);
      },
      function (callback) {
        itemCreate("Boots", "Rain Boots", 5, 500, categories[2], callback);
      },
    ],
    cb
  );
}

async.series(
  [createCategory, createItem],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: " + bookinstances);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
