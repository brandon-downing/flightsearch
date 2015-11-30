var express = require('express'),
 	router = express.Router(),
 	ctrl = require('../controllers/flights');


/* GET home page. */
router.get('/', ctrl.home);
router.get('/flights', ctrl.flights);
router.get('/search', ctrl.search);
router.get('/find', ctrl.find);
router.get('/badging', ctrl.badging);
router.get('/findarea', ctrl.findarea);
router.get('/results', ctrl.results);
router.get('/results-flex', ctrl.resultsflex);
router.get('/results-badging', ctrl.resultsbadging);
router.get('/details-flex', ctrl.detailsflex);
router.get('/details-badging', ctrl.detailsbadging);
router.get('/details', ctrl.details);
router.get('/flight-detail', ctrl.flightDetail);
router.get('/seating-map', ctrl.seatingMap);

module.exports = router;
