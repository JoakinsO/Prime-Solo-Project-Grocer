const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();


// GET Routes

// runs if POST '/login' comes back successful
router.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.user);
  } else {
    res.sendStatus(403);
  }
});

// logs out and clears all server session information about this user
router.get('/logout', (req, res) => {
  req.logout();
  res.sendStatus(200);
});

// POST Routes

// registers new users with the application
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);

  const newPerson = new Person({ username, password });
  newPerson.save()
    .then(() => { res.sendStatus(201); })
    .catch((err) => {next (err); });
});

// recieves login information from the client and runs the passport local strategy
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});


module.exports = router;
