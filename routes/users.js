const bcrypt = require('bcrypt');
const router = require('express').Router();   
const User = require('mongoose').model('User');
const utils = require('../lib/utils');


router.post('/login', function(req, res, next){
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(401).json({ success: false, msg: "could not find user"});
      }

      const isValid = bcrypt.compareSync(req.body.password, user.password);

      if (isValid) {
        const { token, expires } = utils.issueJWT(user);

        res.status(200).json({ success: true, user, token, expiresIn: expires });      
      } else {
        res.status(401).json({ success: false, msg: "you entered the wrong password"});
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/signup', function(req, res, next){
  const { username, email, password } = req.body;

  User.findOne({ email: email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    const user = new User({ username, email, password });
    user.save((err) => {
      if (err) {
        return next(err);
      }
      const { token, expires } = utils.issueJWT(user);
      res.json({ success: true, user, token, expiresIn: expires });
    });
  });
});

module.exports = router;