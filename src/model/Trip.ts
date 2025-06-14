import mongoose, { Schema, model, models } from 'mongoose';

const TripSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  startDate: Date,
  endDate: Date,
  valleyRoute: [{ type: Schema.Types.ObjectId, ref: 'Valley' }],
  status: { type: String, enum: ['planned', 'in-progress', 'completed'], default: 'planned' }
}, { timestamps: true });

export default models.Trip || model('Trip', TripSchema);
