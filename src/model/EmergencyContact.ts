import mongoose, { Schema, model, models } from 'mongoose';

const EmergencyContactSchema = new Schema({
  valleyId: { type: Schema.Types.ObjectId, ref: 'Valley' },
  type: { type: String, enum: ['hospital', 'police', 'fire'] },
  name: String,
  address: String,
  phone: String
});

export default models.EmergencyContact || model('EmergencyContact', EmergencyContactSchema);
