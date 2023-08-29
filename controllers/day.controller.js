const mongoose = require('mongoose');
const Day = require('../models/Day.model');

const getAllDays = async (req, res, next) => {
    try {
        const days = await Day.find();
        res.status(200).json(days);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching days.', error });
    }
}

const createDay = async (req, res, next) => {
    const { name, hours, date } = req.body;
    
    try {
        const newDay = await Day.create({ name, hours, date });
        res.status(201).json(newDay);
    } catch (error) {
        res.status(500).json({ message: 'Error while creating day.', error });
    }
}

const getOneDay = async (req, res, next) => {
    const dayId = req.params.dayId;
    
    try {
        const day = await Day.findById(dayId);
        
        if (!day) {
            return res.status(404).json({ message: 'Day not found.' });
        }
        
        res.status(200).json(day);
    } catch (error) {
        res.status(500).json({ message: 'Error while fetching day.', error });
    }
}

const updateOneDay = async (req, res, next) => {
    const dayId = req.params.dayId;
    const updatedData = req.body;
    
    try {
        const updatedDay = await Day.findByIdAndUpdate(dayId, updatedData, { new: true });
        
        if (!updatedDay) {
            return res.status(404).json({ message: 'Day not found.' });
        }
        
        res.status(200).json(updatedDay);
    } catch (error) {
        res.status(500).json({ message: 'Error while updating day.', error });
    }
}

const deleteOneDay = async (req, res, next) => {
    const dayId = req.params.dayId;
    
    try {
        const deletedDay = await Day.findByIdAndRemove(dayId);
        
        if (!deletedDay) {
            return res.status(404).json({ message: 'Day not found.' });
        }
        
        res.status(200).json({ message: 'Day deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error while deleting day.', error });
    }
}

module.exports = {
    getAllDays,
    createDay,
    getOneDay,
    updateOneDay,
    deleteOneDay
}
