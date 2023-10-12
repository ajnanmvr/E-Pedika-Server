const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:String,
    default:"user",
    enum:['user','admin']
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
