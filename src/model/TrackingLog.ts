import mongoose, { Schema, model, models } from 'mongoose';

const TrackingLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  tripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: Number,
    lng: Number
  },
  autoDetectedValley: { type: Schema.Types.ObjectId, ref: 'Valley' },
  type: { type: String, enum: ['interval', 'arrival'], default: 'interval' }
});

export default models.TrackingLog || model('TrackingLog', TrackingLogSchema);
