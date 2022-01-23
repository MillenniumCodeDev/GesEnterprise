const express = require("express");
const router = express.Router();

// Configuration File
const { dirname } = require('path');
const config = require(dirname(require.main.filename) + '/../config.json'); // ../ because we are in the bin folder

// MongoDB
const {MongoClient} = require('mongodb');


// Logging
const debug = require('debug');
const createError = require("http-errors");
const log   = debug('app:log');
const warn  = debug('app:warn'); 
const error = debug('app:error'); 


router.get('/', async function(req, res, next) {
  const db_url = "mongodb://"+config.database.user+":"+ encodeURIComponent(config.database.password) +"@"+ config.database.host +":"+ config.database.port +"/" + "?ssl=false";
  log("Connecting to database: " + db_url);
  // Connect to the db
  const client = new MongoClient(db_url);
  try {
    await client.connect();
    db = await client.db(config.database.database);

    res.json({
      "company": config.company.name,
      "employees": await db.collection('employees').count()
    });
  } catch (err) {
    error("An error ocurred during MongoDB connection/query: " + err);
    next(createError(500)); // Internal Server Error
  } finally {
    await client.close();
  }
  
});

router.all('/', function(req, res, next) {
  log(req.id + ": Method not allowed");
  next(createError(405));
});
module.exports = router;
