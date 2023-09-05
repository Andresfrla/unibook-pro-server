const mongoose = require('mongoose');
const Calendar = require('../models/Calendar.model');
const Day = require('../models/Day.model');

const createOrUpdateCalendar = async (req,res,next) => {
    try{
        const { reservations } = req.body;
        // 1. Si el admin ya tiene un calendario, lo tomamos
        // para actualizarlo.
        const { userId: adminId } = req.payload  
        const calendar = await Calendar.findOne({adminId})
        .populate({
            path: "days"
        })

        const previousDays = calendar.days
        let calendarId = calendar && calendar._id
        
        if(!calendarId){
            const newCalendar = await Calendar.create({adminId})
            calendarId = newCalendar._id;
        } 
        
        // 2. Ahora vamos a guardar los Id de los dias
        // seleccionados en el body
        const days = []
        for (const day of Object.keys(req.body)) {
            const reservations = previousDays.filter(previousDay => previousDay === day)
            .flatMap(day => day.reservations)

            const calendarDay = await Day.create({
                name: day,
                openedHours: req.body[day], 
                // date: new Date()
                reservations
            })
            days.push(calendarDay._id)
        }

        // y agregamos los dias al calendario que le mostraremos a nuestro cliente
        // para que vea nuestra disponibilidad
        await Calendar.findByIdAndUpdate(
        calendarId, // buscamos el calendario asociado al user
        { $set: { days: days } }, // y le agregamos los dias creados
        { new: true }, 
        )

        Calendar.create({adminId, reservations})
    }
    catch {
        res.status(500).json()
    }
}

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

module.exports = {
    createOrUpdateCalendar,
    getCalendarByAdmin
}
