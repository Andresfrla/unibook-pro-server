const router = require("express").Router();

const {
    createOrUpdateCalendar,
    getCalendarByAdmin
} = require("../controllers/calendar.controller");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Create and update One Calendar
router.post("/:adminId",
    isAuthenticated,
    createOrUpdateCalendar,
);

//Get a calendar from every Admin
router.get("/:adminId",
    isAuthenticated,
    getCalendarByAdmin
);

module.exports = router;