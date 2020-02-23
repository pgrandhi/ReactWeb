const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CollectionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name:{
    type: [String]
  },
  PostLinks: {
    type: [String]
  }
});
module.exports = Story = mongoose.model('collection', CollectionSchema);