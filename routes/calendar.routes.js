const router = require("express").Router();

const {
    createOrUpdateCalendar,
    getCalendarByAdmin,
    deleteDayAndHour
} = require("../controllers/calendar.controller");


// Create and update One Calendar
router.post("/:adminId",
    createOrUpdateCalendar,
);

//Get a calendar from every Admin
router.get("/:adminId",
    getCalendarByAdmin
);

// Delete one hour and day
router.delete("/:adminId/borrar/:dayId",
    deleteDayAndHour   
);

module.exports = router;