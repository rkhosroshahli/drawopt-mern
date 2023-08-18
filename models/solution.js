const { Double } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// const schemaOptions = {
//   timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
// };

const solutionSchema = new Schema({
  optimizer: { 
    algorithm: { type: String, required: true },
    np: { type: Number, required: true },
    maxIter: { type: Number, required: true },
    params: { ype: String, required: true }
    },
  optimizedSolution: {
    x: { type: Number, required: true },
    f: { type: Number, required: true}
  },
  optimizedPopulation: [{
    x: { type: Number, required: true },
    f: { type: Number, required: true }
  }],
  pointsId: { type: mongoose.Types.ObjectId, required: true, ref: 'Point' }
  // dateCreated: {type: Date, default: Date.now}
  // creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' }
  }, {
    timestamps: true
  });

module.exports = mongoose.model('Solution', solutionSchema);