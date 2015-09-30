var request = require('request');

module.exports.home = function(req, res){
	res.render('index', { title: 'Search Flights' });
};

module.exports.flights = function(req, res){
	var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport;
	var flightApiOptions = {
    		url: "https://www.expedia.com:443/api/flight/search?departureDate="+ departureDate +"&departureAirport="+ departureAirport +"&arrivalAirport="+ arrivalAirport,  
    		method: "GET"
		};



request(flightApiOptions, function(err, response, body){
    if(err){
        console.log(err);
    } else if (response.statusCode === 200) {
    		var responseBody = JSON.parse(body);
    		console.log(responseBody.legs);
    		res.render('flights', { title: 'Flights Results', flightlegs: responseBody.legs, flightoffers: responseBody.offers });
    		//res.render('leagues', { title: 'European Football Leagues', leaguedata: leagues, season: season });
    } else {
        console.log(response.statusCode);
    }
});
	
};