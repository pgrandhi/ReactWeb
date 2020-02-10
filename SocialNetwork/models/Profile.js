const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  name: {
    type: String,
    required: true,
    max: 40
  },
  username: {
    type: String,
    required: true,
    max: 40
  },
  ProfilePicLink: {
    type: String
  },
  website: {
    type: String
  },
  bio: {
    type: String
  },
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  following:[
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  linkedAccounts: [
    {
      socialMediaAccount: {
        type: String,
        required: true
      },
      UsernameorEmail: {
        type: String,
        required: true
      },
      Password: {
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