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
router.post('/', createService, isAdmin)

// /api/services/serviceID
router.get('/:servicesId', getOneService)
router.put('/:servicesId', updateOneService, isAdmin)
router.delete('/:servicesId', deleteOneService, isAdmin)

module.exports = router;