const mongoose = require('mongoose')
const Service = require('../models/Service.model')

const getAllServices = async (req, res, next) => {
    try {
        const allServices = await Service.find();
        res.status(200).json(allServices);
    } catch (error) {
        res.status(500).json(error);
    }
}

const createService = async (req, res, next) => {
    const { image, name, description, price, duration } = req.body;
    try {
        const newService = await Service.create({image, name, description, price, duration})
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
    const { serviceId } = req.params;
    res.status(200).json({message: `Updating project whit id ${serviceId}`})
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