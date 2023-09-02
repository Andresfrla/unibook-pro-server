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
        const newService = await Service.create({ image, name, description, price, duration });
        res.status(201).json(newService);
    } catch (error) {
        console.error("Error al crear el servicio:", error);
        res.status(500).json(error);
    }
}

const getOneService = async (req, res, next) => {
    const { serviceId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(serviceId)) {
            res.status(400).json({message: 'The id send is not valid'})
            return
        }
        const service = await Service.findById(serviceId)

        res.status(200).json(service)
    } catch (error) {
        res.status(500).json(error);    
    }
}

const updateOneService = async (req, res, next) => {
    const { serviceId } = req.params;
    const updatedData = req.body; // Datos actualizados del servicio

    try {
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            res.status(400).json({ message: 'The id sent is not valid' });
            return;
        }

        // Actualiza el servicio
        const updatedService = await Service.findByIdAndUpdate(
            serviceId,
            updatedData,
            { new: true } // Devuelve el servicio actualizado
        );

        if (!updatedService) {
            res.status(404).json({ message: 'Service not found' });
            return;
        }

        res.status(200).json(updatedService);
    } catch (error) {
        res.status(500).json(error);
    }
};


const deleteOneService = async (req, res, next) => {
    const { serviceId } = req.params;
    try {
        if(!mongoose.Types.ObjectId.isValid(serviceId)) {
            res.status(400).json({message: 'The id send is not valid'})
            return
        }
        const service = await Service.findByIdAndRemove(serviceId)
        res.status(200).json({message: `The service with id ${serviceId} was removed`})
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