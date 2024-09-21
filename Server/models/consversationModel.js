// models/Conversation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);
