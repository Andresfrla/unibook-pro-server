const router = require("express").Router();

const {
    createReservation,
    getAllReservations,
    assingReservation,
    patchRemoveUser,
    deleteResevation
} = require("../controllers/reservations.controller")

// Verify the user exist on DB
/* const { isUser } = require('../middleware/isUser.middleware') */