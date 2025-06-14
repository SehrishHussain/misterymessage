import mongoose, { Schema, model, models } from 'mongoose';

const ChecklistItemSchema = new Schema({
  valleyId: { type: Schema.Types.ObjectId, ref: 'Valley' },
  title: String,
  category: { type: String, enum: ['clothing', 'health', 'documents'] }
});

export default models.ChecklistItem || model('ChecklistItem', ChecklistItemSchema);
