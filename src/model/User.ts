import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  loginMethod: { type: String, enum: ['email', 'google', 'apple'], default: 'email' },
  locationTracking: {
    enabled: { type: Boolean, default: true },
    intervalInMinutes: { type: Number, default: 30 },
    fullTripTracking: { type: Boolean, default: false }
  }
}, { timestamps: true });

export default models.User || model('User', UserSchema);
