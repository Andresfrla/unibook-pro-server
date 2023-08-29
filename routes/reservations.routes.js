const router = require("express").Router();

const {
    createReservation,
    getAllReservations,
    assignReservation,
    patchRemoveUser,
    deleteReservation
} = require("../controllers/reservations.controller")

// Verifies that Admin is in DB
const { isAdmin } = require("../middleware/isAdmin.middleware")

// Create a available Reservation and add it to the Admin
router.post("/user/:adminId", createReservation)

// Get all the reservations from the Admin
router.get("/user/:userId", getAllReservations)

// Update Reservation from Admin list (Before 24 hours)
router.put("/:reservationId/admin/:adminId/user/:userId",
    assignReservation,
)

// Remove reservation from Admin list by user (Only 24 hour before)
router.patch("/:reservationId/admin/:adminId/user/:userId",
    patchRemoveUser
)

// Delete reservation from Admin reservation list (Only not booked before 24 hour)
router.delete("/:reservationId/admin/:adminId",
    deleteReservation
)

module.exports = router