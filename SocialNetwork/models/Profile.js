const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  profilePicUrl: {
    type: String
  },
  website: {
    type: String
  },
  bio: {
    type: String
  },
  phone: {
    type: String,
  },
  gender: {
    type: String
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      following: {
        type: Boolean
      }      
    }
  ],
  following:[
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      following: {
        type: Boolean
      }
    }
  ],
  linkedAccounts: [
    {
      account: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);