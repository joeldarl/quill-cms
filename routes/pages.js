const router = require('express').Router();
var auth = require('../auth/auth');
const config = require('../config/config.json');

router.get('/', auth.optional, function(req, res, next) {
    res.render('about', { title: config.title });
});

module.exports = router;