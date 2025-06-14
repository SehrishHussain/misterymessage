import mongoose, { Schema, model, models } from 'mongoose';

const DangerZoneSchema = new Schema({
  valleyId: { type: Schema.Types.ObjectId, ref: 'Valley' },
  description: String,
  location: {
    lat: Number,
    lng: Number
  },
  reportedByUser: { type: Schema.Types.ObjectId, ref: 'User' },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default models.DangerZone || model('DangerZone', DangerZoneSchema);
