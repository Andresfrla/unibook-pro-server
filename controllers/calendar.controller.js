const mongoose = require('mongoose');
const Calendar = require('../models/Calendar.model');

const getCalendarByAdmin = async (req, res, next) => {
    const adminId = req.params.adminId; 
    
    try {
        const calendar = await Calendar.findOne({ adminId }).populate('reservations');
        
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found for this admin.' });
        }
        
        res.status(200).json(calendar);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching calendar.', error });
    }
}

const updateCalendar = async (req, res, next) => {
    const adminId = req.params.adminId;
    const newReservations = req.body.reservations; 
    
    try {
        const calendar = await Calendar.findOne({ adminId });
        
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found for this admin.' });
        }
        
        // Update the reservations in the calendar
        calendar.reservations = newReservations;
        const updatedCalendar = await calendar.save();
        
        res.status(200).json(updatedCalendar);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating calendar.', error });
    }
}

module.exports = {
    getCalendarByAdmin,
    updateCalendar
}
