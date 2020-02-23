const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  MediaLinks: {
    type: [String],
    required: true
  },
  caption: {
    type: String
  },
  tags: {
    type: [String]
  },
  location: {
    type: String
  },
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      Icon: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  sendTo: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  socialMedia: {
    facebook: {
      type: Boolean
    },
    twitter: {
      type: Boolean
    },
    tumblr: {
      type: Boolean
    }
  },
  collection: 
    {
        type: Schema.Types.ObjectId,
        ref: 'collections'
    },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);