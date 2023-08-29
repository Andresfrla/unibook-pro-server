const mongoose = require('mongoose');
const Reservation = require('../models/Reservation.model');

const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching reservations.', error });
    }
}

const createReservation = async (req, res, next) => {
    const { dayInfo, hours, services, userId } = req.body;
    
    try {
        const newReservation = await Reservation.create({ dayInfo, hours, services, userId });
        console.log("newReservation: ", newReservation)
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: 'Error while creating reservation.', error });
    }
}

const getOneReservation = async (req, res, next) => {
    const reservationId = req.params.reservationId;
    
    try {
        const reservation = await Reservation.findById(reservationId);
        
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        
        res.status(200).json(reservation);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching reservation.', error });
    }
}

const updateOneReservation = async (req, res, next) => {
    const reservationId = req.params.reservationId;
    const updatedData = req.body;
    
    try {
        const updatedReservation = await Reservation.findByIdAndUpdate(reservationId, updatedData, { new: true });
        
        if (!updatedReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        
        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating reservation.', error });
    }
}

const deleteOneReservation = async (req, res, next) => {
    const reservationId = req.params.reservationId;
    
    try {
        const deletedReservation = await Reservation.findByIdAndRemove(reservationId);
        
        if (!deletedReservation) {
            return res.status(404).json({ message: 'Reservation not found.' });
        }
        
        res.status(200).json({ message: 'Reservation deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting reservation.', error });
    }
}

module.exports = {
    getAllReservations,
    createReservation,
    getOneReservation,
    updateOneReservation,
    deleteOneReservation
}
