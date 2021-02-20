const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  article: String,
  name: String,
  description: String,
  price: Number,
  quantity: Number,
  foto: String,
  updatedAt: Date,
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' },

});

module.exports = mongoose.model('Item', ItemSchema);
