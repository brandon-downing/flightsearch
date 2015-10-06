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
    console.log(flightApiOptions.url);
    if(err){
        console.log(err);
    } else if (response.statusCode === 200) {
    		var responseBody = JSON.parse(body), 
                flightOffers = []; 
                (function(){
                    responseBody.offers.forEach(function(item, index, array){
                        var newItem = parseInt(item.baseFare);
                            item.baseFareNum = newItem;
                            flightOffers.push(item);
                    });
                }());
                
                var flightOffersSorted = flightOffers.sort(function(a,b){
                    return a.baseFareNum - b.baseFareNum;
                });
    		
    		res.render('flights', { title: 'Flight Results', flightlegs: responseBody.legs, flightoffers: flightOffersSorted, 
                departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport });
    		
    } else {
        console.log(response.statusCode);
    }
});
	
};