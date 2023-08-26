const router = require("express").Router();

const {
    createReservation,
    getAllReservations,
    assingReservation,
    patchRemoveUser,
    deleteResevation
} = require("../controllers/reservations.controller")

// Create a available Reservation and add it to the Admin
router.post("/user/:adminId", createReservation)


// Get all the reservations from the Admin
router.get("/user/:userId", getAllReservations)

// Update Reservation from Admin list (Before 24 hours)
router.put("/:reservationId/admin/:adminId/user/:userId",
    assingReservation,
)

// Remove reservation from Admin list by user (Only 24 hour)
router.patch("/:reservationId/admin/:adminId/user/:userId",
    patchRemoveUser
)

// Delete reservation from Admin reservation list (Only not booked before 24 hour)
router.delete("/:reservationId/admin/:adminId",
    deleteResevation
)

module.exports = router