const router = require("express").Router();

const {
    createOrUpdateCalendar,
    getCalendarByAdmin
} = require("../controllers/calendar.controller");


// Create and update One Calendar
router.post("/:adminId",
    createOrUpdateCalendar,
);

//Get a calendar from every Admin
router.get("/:adminId",
    getCalendarByAdmin
);

module.exports = router;