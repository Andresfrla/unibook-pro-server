const getAllServices = (req, res, next) => {
    res.status(200).json({message: 'Here are all the found projects'})
}

const createService = (req, res, next) => {
    res.status(201).json({message: 'A new service was created'});
}

const getOneService = (req, res, next) => {
    const { servicesId } = req.params;
    res.status.json({message: `This is the project whit id ${servicesId}`})
}

const updateOneService = (req, res, next) => {
    const { servicesId } = req.params;
    res.status.json({message: `Updating project whit id ${servicesId}`})
}

const deleteOneService = (req, res, next) => {
    const { servicesId } = req.params;
    res.status.json({message: `Delete project whit id ${servicesId}`})
}

module.exports = {
    getAllServices,
    createService,
    getOneService,
    updateOneService,
    deleteOneService
}