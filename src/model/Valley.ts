import mongoose, { Schema, model, models } from 'mongoose';

const ValleySchema = new Schema({
  name: { type: String, required: true },
  coordinates: {
    lat: Number,
    lng: Number,
  },
  description: String,
  climateNotes: String,
  emergencyContacts: [{ type: Schema.Types.ObjectId, ref: 'EmergencyContact' }],
  connectedValleys: [{ type: Schema.Types.ObjectId, ref: 'Valley' }]
}, { timestamps: true });

export default models.Valley || model('Valley', ValleySchema);
