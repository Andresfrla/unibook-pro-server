const mongoose = require('mongoose')
const Service = require('../models/Service.model')

const getAllServices = (req, res, next) => {
    res.status(200).json({message: 'Here are all the found projects'})
}

const createService = async (req, res, next) => {
    const { image, service, description, price } = req.body;
    try {
        const newService = await Service.create({image, service, description, price})
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json(error);    
    }
}

const getOneService = async (req, res, next) => {
    const { servicesId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(servicesId)) {
            res.status(400).json({message: 'The id send is not valid'})
            return
        }
        const service = await Service.findById(servicesId)

        res.status(200).json(service)
    } catch (error) {
        res.status(500).json(error);    
    }
}

const updateOneService = (req, res, next) => {
    const { servicesId } = req.params;
    res.status(200).json({message: `Updating project whit id ${servicesId}`})
}

const deleteOneService = async (req, res, next) => {
    const { servicesId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(servicesId)) {
            res.status(400).json({message: 'The id send is not valid'})
            return
        }
        const service = await Service.findByIdAndRemove(servicesId)
        res.status(200).json({message: `The service with id ${servicesId} was removed`})
    } catch (error) {
        res.status(500).json(error);    
    }
}

module.exports = {
    getAllServices,
    createService,
    getOneService,
    updateOneService,
    deleteOneService
}