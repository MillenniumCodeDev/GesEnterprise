const express = require("express");
const router = express.Router();
const createError = require("http-errors");

const gesenterprise = require("gesenterprise");

router.post("/", async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password; // Password should be SHA-256 encrypted
  if (!email || !password) { gesenterprise.warn(`${req.id}: Missing email or password`); return next(createError(400)); } 
  try {
    const sessionId = await gesenterprise.session.addSession(email, password);
    if (sessionId == "WRONG_EMAIL_OR_PASSWORD") { return next(createError(401)); }
    gesenterprise.info(`${req.id}: Login sucessful`);
    res.json({
      "sucess": "true",
      "sessionId": sessionId._id
    });
  } catch (err) {
    gesenterprise.error(`${req.id}: Something went wrong: ` + err);
    return next(createError(500)); // Internal Server Error
  }
});

router.all("/", function(req, res, next) {
  gesenterprise.warn(req.id + ": Method not allowed");
  next(createError(405));
});
module.exports = router;
