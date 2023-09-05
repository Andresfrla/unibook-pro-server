const express = require("express");
const router = express.Router();
const servicesRouter = require('./services.routes')
const reservationsRouter = require('./reservations.routes')
const calendarRouter = require('./calendar.routes.js')

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to unibook pro API"});
});

router.use('/servicios', servicesRouter);
router.use('/reservar-ahora', reservationsRouter);
router.use('/calendario', calendarRouter);

module.exports = router;
