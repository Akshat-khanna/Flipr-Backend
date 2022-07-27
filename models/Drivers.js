import mongoose from 'mongoose'

const placesSchema = mongoose.Schema({
    toState: { type: String },
    fromState: { type: String },
    toCity: { type: String },
    fromCity: { type: String },
})

const authSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const driverSchema = mongoose.Schema({
    name: { type: String, required: true },
    authData: authSchema,
    id: { type: String },
    age: { type: Number },
    truckNumber: { type: String },
    mobileNumber: { type: String },
    truckCapacity: { type: Number },
    transporterName: { type: String },
    drivingExperience: { type: String },
    interestedRoutes: [placesSchema]
})

export default mongoose.model('Driver', driverSchema)
