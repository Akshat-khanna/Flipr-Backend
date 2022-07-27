import mongoose from 'mongoose'

const placesSchema = mongoose.Schema({
    state: { type: String },
    city: { type: String },
})

const authSchema = mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const dealerSchema = mongoose.Schema({
    name: { type: String, required: true },
    authData: authSchema,
    id: { type: String },
    natureOfMaterial: { type: String },
    mobileNumber: { type: String },
    weightOfMaterial: { type: Number },
    quantity: { type: Number },
    location: [placesSchema]
})

export default mongoose.model('Dealer', dealerSchema)