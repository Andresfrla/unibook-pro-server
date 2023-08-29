const User = require("../models/User.model")
const Reservation = require("../models/Reservation.model");
const Admin = require("../models/Admin.model");

const createReservation = async (req ,res ,next) => {
    try {
        const { adminId } = req.params;
        const { dayInfo, hour } = req.body;

        if (!dayInfo || !hour) {
            res.status(400).json({message: 'The date and the hour are require.'})
            return 
        }

        if(isNaN(Date.parse(dayInfo))) {
            res.status(400).json({message: 'dayInfo must be a valid date format (YYYY/MM/DD)'})
            return
        }

        const options = {
            timeZone: "America/Los_Angeles",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }
        const currentDate = new Date().toLocaleString("en-US", options)
        const dateInput = new Date(dayInfo).toLocaleString("en-US", options)
          
        const today = new Date(currentDate)

        if (new Date(dateInput) < today.setDate(today.getDate() + 1)) {
            res.status(400).json({ message: "dayInfo cannot be in the past or in within the next 24h",})
            return
          }

        if (hour < 11 || hour > 18 || hour % 1 !== 0) {
            res.status(400).json({ message: "Hour must be an integer between 11 and 18" })
            return
          }
      
        const admin = await Admin.findById(adminId).populate("schedule")
        const {schedule: adminSchedule} = admin;
        
        let slotTaken = false;
        adminSchedule.forEach((reservation) => {
            if(reservation.hour === hour && reservation.dayInfo === dayInput) {
                slotTaken = true
                return
            }
        })

        if(slotTaken) {
            res.status(409).json({message: `${dayInfo} @ ${hour} is already in schedule`})
            return
        }

        const createdReservation = await Reservation.create({
            dayInfo: dateInput,
            hour
        })

        const updateAdmin = await Admin.findByIdAndUpdate(
            { $push: { schedule: createdReservation._id }},
            { new: true }
        )
        .populate("schedule")
        .select("-password") 
        res.status(201).json({message: "Reservation created", updateAdmin})
        
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const getAllReservations = async (req, res, next) => {
    try {
        const { admin } = req.params;

        const adminInDB = await Admin.findById(admin)
        .populate({
            path: "schedule",
            populate: {
                path: "userId"
            }
        })

        const { schedule } = adminInDB
        const sortedSchedule = schedule.sort(
            (a,b) =>
            new Date(`${a.dayInfo}`).setHours(a.hour) -
            new Date(`${b.dayInfo}`).setHours(b.hour))
        
            res.status(200).json({schedule: sortedSchedule})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const assignReservation = async (req, res, next) => {
    try {
        const { reservationId, userId } = req.params;

        const reservationInDB = await Reservation.findById(reservationId)
        const userInDB = await User.findById(userId)

        if (!reservationInDB.isAvailable && JSON.stringify(userInDB._id) !== JSON.stringify(reservationInDB.userId)){
            res.status(423).json({message: "No available date it is already reserved"})
            return
        }

        const { dayInfo } = reservationInDB

        const options = {
            timeZone: "America/Los_Angeles",
            year: "numeric",
            month: "numeric",
            day: "numeric"
        }
        const currentDate = new Date().toLocaleDateString("en-US", options)
        const dateInReservation = new Date(dayInfo).toLocaleDateString("en-US", options)

        const today = new Date(currentDate)
        if(new Date(dateInReservation) < today.setDate(today.getDate() + 1)) {
            res.status(400).json({message: "Can not reserve after 24 Hours"})
            return
        }

        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { userId, isAvailable: false},
            { new: true }
        )

        res.status(200).json({message: `${updatedReservation.dayInfo} @ ${updatedReservation.hour} booked`, updatedReservation})
    } catch (error) {
        res.status(500).json({message: "Internal server error"})
    }
}

const patchRemoveUser = async (req, res, next) => { 
    try {
      const userInDB = await User.findById(req.params.userId)
      const { _id: userId } = userInDB
      const reservationInDB = await Reservation.findById(req.params.reservationId)
  
      if (JSON.stringify(reservationInDB.traineeId) !== JSON.stringify(userId)) {
        res.status(400).json({message:"Target Reservation does not contain the userId to be removed.",})
        return
      }
  
      const { dayInfo } = reservationInDB
  
      const options = {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
      const currentDate = new Date().toLocaleString("en-US", options)
      const dateInReservation = new Date(dayInfo).toLocaleString(
        "en-US",
        options
      )
  
      const today = new Date(currentDate)
      if (new Date(dateInReservation) < today.setDate(today.getDate() + 1)) {
        res.status(400).json({
          message: "Cannot remove appointment prior to 24 hours",
        })
        return
      }
  
      const { traineeId: userIdParams} = req.params
      const updatedReservation = await Reservation.findByIdAndUpdate(
        req.params.reservationId,
        { $unset: { userId: userIdParams, isAvailable: true } },
        { new: true }
      )
  
      res.status(200).json({message: "Removed userId", updatedReservation})
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
  }

const deleteReservation = async (req, res, next) => {
    try {
      const { reservationId, adminId } = req.params
      
      const { dayInfo } = await Reservation.findById(reservationId)
      const options = {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }
      const currentDate = new Date().toLocaleString("en-US", options)
      const dateInReservation = new Date(dayInfo).toLocaleString("en-US", options)
      const today = new Date(currentDate)
      if (new Date(dateInReservation) < today.setDate(today.getDate() + 1)) {
        res.status(400).json({ message: "Cannot delete prior to 24 hours",})
        return
      }
      
      const deletedReservation = await Reservation.findByIdAndDelete(reservationId)
      const updatedAdmin = await Admin.findByIdAndUpdate(
        adminId,
        { $pull: { schedule: reservationId } },
        { new: true }
      ).select('-password')
  
      res.status(200).json({message: "Reservation deleted", deletedReservation, updatedAdmin})
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
  }

module.exports = {
    createReservation,
    getAllReservations,
    assignReservation,
    patchRemoveUser,
    deleteReservation
}