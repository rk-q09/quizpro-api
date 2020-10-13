const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String
});

UserSchema.pre('save', function (next) {
    const user = this;
    const plainPassword = user.password;
    const saltRounds = 10;
  
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        return next(err);
      }
      bcrypt.hash(plainPassword, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
  
        user.password = hash;
        next();
      });
    });
  });

mongoose.model('User', UserSchema);