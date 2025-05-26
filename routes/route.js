const express = require('express')
const router = express.Router()
const cors = require('cors')

// Enable CORS
router.use(cors())

// Routes
const userRoutes = require('../Modules/user/userRoutes');
const basicInfoRoutes = require('../Modules/HostList/basicInfo/basicInfoRoutes');
const locationDetailsRoutes = require('../Modules/HostList/locationDetails/locationDetailsRoutes');
const roomSetupRoutes = require('../Modules/HostList/roomSetup/roomSetupRoutes');
const getall = require('../Modules/HostList/getAll/getAllRoutes');
const uploadImagesRoutes = require('../Modules/HostList/UploadImages/UploadImagesRoutes');
const property = require ('../Modules/HostList/propertiesRules/propertiesRoutes')
const amenitiesRoutes = require('../Modules/HostList/amenities/routes');
const roomPricingRoutes = require('../Modules/HostList/RoomPricing/RoomPricingroutes')
const propertyDetailsRoutes = require('../Modules/HostList/PropertyDetails/PropertyDetailsRoutes');
// API Routes
router.use('/auth', userRoutes)
router.use('/basicInfo', basicInfoRoutes)
router.use('/location', locationDetailsRoutes)
router.use('/roomSetup', roomSetupRoutes)
router.use('/getall', getall)   
router.use('/uploadImages', uploadImagesRoutes)
router.use('/property', property)
router.use('/amenities', amenitiesRoutes)
router.use('/roomPricing', roomPricingRoutes)
router.use('/propertyDetails', propertyDetailsRoutes)





  module.exports = router