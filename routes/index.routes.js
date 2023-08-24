const express = require("express");
const router = express.Router();
const servicesRouter = require('./services.routes')

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to unibook pro API"});
});

router.use('/servicios', servicesRouter)

module.exports = router;
