const express = require("express");
const router = express.Router();
const servicesRouter = require('./services.routes')
const reservationsRouter = require('./reservations.routes')
const calendarRouter = require('./calendar.routes.js')
const { isAuthenticated } = require("../middleware/jwt.middleware"); 

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to unibook pro API"});
});

router.use('/servicios', servicesRouter);
router.use('/reservar-ahora', isAuthenticated, reservationsRouter);
router.use('/calendario', isAuthenticated, calendarRouter);

module.exports = router;
