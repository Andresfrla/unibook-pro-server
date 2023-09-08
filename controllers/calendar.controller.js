const mongoose = require('mongoose');
const Calendar = require('../models/Calendar.model');
const Day = require('../models/Day.model');
const dayjs = require('dayjs')

const createOrUpdateCalendar = async (req, res, next) => {
    try {
        const { reservations } = req.body;
        const { _id: adminId } = req.payload;

        let calendar = await Calendar.findOne({ adminId }).populate({
            path: 'days',
            model: 'Day'
        });

        if (!calendar) {
            calendar = new Calendar({ adminId });
        }

        const previousDays = calendar.days || [];
        const days = [];
        const { availableHours } = req.body;

        for (const dayInfo of availableHours) {
            const date = dayInfo.substring(0, 10);
            const time = dayInfo.split('-')[3];
            const hours = parseFloat(time.split(':')[0]);

            const calendarDay = await Day.create({
                name: date,
                openedHours: hours,
                date: new Date(date),
                reservations: previousDays.find((prevDay) => prevDay.name === date)?.reservations || [],
            });

            days.push(calendarDay._id);
        }

        calendar.days = days; // Asignar los días al calendario

        await calendar.save(); // Guardar el calendario

        Calendar.create({ adminId, reservations });
        res.status(200).json({ message: 'Calendar updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Problem creating/updating the calendar', error });
    }
};


const getCalendarByAdmin = async (req, res, next) => {
    const adminId = req.params.adminId; 
    
    try {
        const calendar = await Calendar.findOne({ adminId })
        .populate('adminId')
        .populate({
            path: 'days', 
/*             populate: { 
               path: 'reservation', 
               model: 'Reservation'
           } */
       })
       
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found for this admin.' });
        }
        
        res.status(200).json(calendar);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching calendar.', error });
    }
}

module.exports = {
    createOrUpdateCalendar,
    getCalendarByAdmin
}
