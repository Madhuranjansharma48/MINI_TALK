const { Schema, model } = require('mongoose');

const MessageSchema = new Schema(
  {
    msg_id: { type: String, required: true, unique: true, index: true },
    meta_msg_id: { type: String, index: true },
    wa_id: { type: String, required: true, index: true }, // conversation owner
    from: { type: String, required: true },
    to: { type: String, required: true },
    text: { type: String, default: '' },
    type: { type: String, enum: ['text'], default: 'text' },
    direction: { type: String, enum: ['inbound', 'outbound'], required: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read', 'unknown'],
      default: 'unknown',
    },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

MessageSchema.index({ wa_id: 1, timestamp: -1 });

module.exports = model('Message', MessageSchema);
