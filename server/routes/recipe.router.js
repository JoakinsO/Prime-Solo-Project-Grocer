const express = require('express');
const encryptLib = require('../modules/encryption');
const Person = require('../models/Person');
const userStrategy = require('../strategies/user.strategy');

const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

module.exports = router;
