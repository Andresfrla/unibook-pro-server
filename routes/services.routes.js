const { Router } = require('express');
const { 
    getAllServices,
    createService,
    getOneService,
    updateOneService,
    deleteOneService 
} = require('../controllers/services.controller');
const { isAdmin } = require('../middleware/isAdmin.middleware');

const router = Router();

// /api/services
router.get('/', getAllServices);
router.post('/', createService)

// /api/services/serviceID
router.get('/:servicesId', getOneService)
router.put('/:servicesId', updateOneService)
router.delete('/:servicesId', deleteOneService)

module.exports = router;