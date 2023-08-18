const { Double } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const schemaOptions = {
//   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
// };

const pointSchema = new Schema({
  points: [{
    x: { type: Number, required: true },
    y: { type: Number, required: true}
  }],
  // dateCreated: {type: Date, default: Date.now}
  // creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
  solutions: [{type: mongoose.Types.ObjectId, required: false, ref: 'Solution'}]
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Point', pointSchema);