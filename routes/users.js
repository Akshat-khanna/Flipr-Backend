import express from 'express'
import { signin, signup, getProfile,bookDriver, getDrivers, getDealers, getDriversByRoute } from '../controller/users.js'
import auth from '../middleware/users.js'
const router = express.Router()

router.post('/signin', signin)
router.post('/signup', signup)
router.get('/me', auth, getProfile)
router.put('/book-driver', auth, bookDriver)
router.get('/get-drivers', getDrivers)
router.get('/get-dealers', auth, getDealers)
router.get('/get-dealers-by-route', auth, getDriversByRoute)

export default router