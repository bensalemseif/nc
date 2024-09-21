const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: { type: String, required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
