const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const gesenterprise = require("gesenterprise");

router.post("/", async function(req, res, next) {
  const sessionId = req.body.sessionId;
  if (!sessionId) { gesenterprise.warn(`${req.id}: Missing Key`); return next(createError(400)); }
  try {
    const sessionStatus = await gesenterprise.session.deleteSession(sessionId);
    if (sessionStatus) {
      res.json({
        "sucess": true
      });
    }
  } catch (err) {
    gesenterprise.error(`${req.id}: Something went wrong: ` + err);
    next(createError(500)); // Internal Server Error
  }
});

router.all("/", function(req, res, next) {
  gesenterprise.info(req.id + ": Method not allowed");
  next(createError(405));
});
module.exports = router;
