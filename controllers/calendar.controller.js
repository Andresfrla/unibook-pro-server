const mongoose = require('mongoose');
const Calendar = require('../models/Calendar.model');
const Day = require('../models/Day.model');
const dayjs = require('dayjs')

const createOrUpdateCalendar = async (req, res, next) => {
    try {
        const { reservations } = req.body;
        const { _id: adminId } = req.payload;

        // Paso 1: Registro de depuración
        console.log("Paso 1: Se recibió la solicitud para crear o actualizar el calendario.");

        // Paso 2: Registro de depuración
        console.log("Datos de la solicitud:", req.body);
        
        let calendar = await Calendar.findOne({ adminId })
        .populate({
            path: 'days'
        });

        console.log("Paso 3: Buscando el calendario para el adminId:", adminId);
        console.log("Calendario encontrado:", calendar);

        let calendarId = calendar && calendar._id

        if (!calendarId) { 
            calendar = await Calendar.create({ adminId });
            console.log("Paso 4: Creando o actualizando el calendario.");
            calendarId = calendar._id
            console.log("ID del calendario creado/actualizado:", calendarId);
        }

        const previousDays = calendar && calendar.days || [];

        const days = [];
        const { availableHours } = req.body;
        console.log("🚀 ~ file: calendar.controller.js:38 ~ createOrUpdateCalendar ~ availableHours:", availableHours)
        const daysObject = []
        const openHoursPerDay = {}

        for (const dayInfo of availableHours) {

            const date = dayInfo.substring(0, 10);
            const time = dayInfo.split('-')[3];
            const hours = parseFloat(time.split(':')[0]);
            if (!openHoursPerDay[date]) {
                openHoursPerDay[date] = [hours]
            } else {
                openHoursPerDay[date].push(hours)
            }
        }

        console.log("openHoursPerDay: ", openHoursPerDay)

        for (const day of Object.keys(openHoursPerDay)) {
            const reservations = previousDays.find((prevDay) => prevDay.name === day)?.reservations || [] 

            const calendarDay = await Day.create({
                name: day,
                openedHours: openHoursPerDay[day],
                date: new Date(day),
                reservations,
            });
            daysObject.push(calendarDay)
            days.push(calendarDay._id);
        }

/*         for (const prevDay of previousDays) {
            for (const calendarDay of daysObject) {
                const oldDate = `${calendarDay._id}`
                
                if(`${calendarDay.name}-${calendarDay.openedHours}` !== `${prevDay.name}-${prevDay.openedHours}`){
                    const calendarDayCopy = `${calendarDay.name}-${calendarDay.openedHours}`
                    const PrevDayCopy = `${prevDay.name}-${prevDay.openedHours}`

                    console.log("Paso 5: Creando días y horas.");
                    console.log("Detalles del día y hora creado:", calendarDayCopy);
                    console.log("Detalles del día y hora previo:", PrevDayCopy);

                    days.push(prevDay._id)
                }
            }
        }  */

        const updatedCalendar = await Calendar.findByIdAndUpdate(
            calendarId, // buscamos el calendario asociado al user
            { $set: { days } }, // y le agregamos los dias creados
            { new: true }, 
        )
        
        console.log("Paso 6: Actualizando los días en el calendario.");
        console.log("Días actualizados:", days);

        console.log("Paso 7: Respondiendo al cliente.");
        console.log("Mensaje de respuesta:", 'Calendar updated successfully');
        res.status(200).json({ message: 'Calendar updated successfully' });
    } catch (error) {
        console.log("🚀 ~ file: calendar.controller.js:63 ~ createOrUpdateCalendar ~ error:", error)
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

const deleteDayAndHour = async (req, res) => {
    try {
 
      const { dayId } = req.params; // Obtener el ID del día de los parámetros de la URL
      const { adminId } = req.payload; // Obtener el ID del administrador desde el token (req.payload)
        
      console.log("adminId: ",adminId)
      console.log("🚀 ~ Inicio de la función deleteDayAndHour");
      console.log('dayId:', dayId);
  
      // Buscar el calendario por adminId
      const calendar = await Calendar.findOne({ adminId });
  
      if (!calendar) {
        console.log('Calendario no encontrado');
        return res.status(404).json({ message: 'Calendar not found' });
      }
  
      // Encontrar el día por su ID
      const dayToRemove = calendar.days.find((dayObj) => dayObj._id.toString() === dayId);
  
      if (!dayToRemove) {
        console.log('Día no encontrado');
        return res.status(404).json({ message: 'Day not found' });
      }
  
      // Filtrar los días y horas excluyendo el día que deseas eliminar
      const updatedDays = calendar.days.filter((dayObj) => dayObj._id.toString() !== dayId);
  
      console.log('Día a eliminar:', dayToRemove);
  
      // Actualizar los días en el calendario y guardar
      calendar.days = updatedDays;
      await calendar.save();
  
      console.log('Calendario actualizado:', calendar);
      res.status(200).json({ message: 'Day deleted successfully' });
    } catch (error) {
      console.error('Error al eliminar el día:', error);
      res.status(500).json({ message: 'Error deleting day', error });
    }
  };

module.exports = {
    createOrUpdateCalendar,
    getCalendarByAdmin,
    deleteDayAndHour
}
