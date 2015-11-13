var express = require('express'),
 	router = express.Router(),
 	ctrl = require('../controllers/flights');


/* GET home page. */
router.get('/', ctrl.home);
router.get('/flights', ctrl.flights);
router.get('/search', ctrl.search);
router.get('/results', ctrl.results);
router.get('/flight-detail', ctrl.flightDetail);

module.exports = router;
