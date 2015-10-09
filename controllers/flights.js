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
                        var newItem = parseInt(item.totalFare);
                            item.totalFareNum = newItem;
                            flightOffers.push(item);
                    });
                }());
                
                var flightOffersSorted = flightOffers.sort(function(a,b){
                    return a.totalFareNum - b.totalFareNum;
                });
    		
    		res.render('flights', { title: 'Flight Results', flightlegs: responseBody.legs, flightoffers: flightOffersSorted, 
                departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport });
    		
    } else {
        console.log(response.statusCode);
    }
});
	
};


module.exports.flightDetail = function(req, res){
    var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport, 
        productKey = req.query.productKey,
        flightDetailApiOptions = {
    		url: 'https://www.expedia.com:443/api/flight/details?departureDate='+ departureDate +'&departureAirport='+ departureAirport +'&arrivalAirport='+ arrivalAirport +'&productKey='+ productKey,  
    		method: "GET"
		};
        
    request(flightDetailApiOptions, function(err, response, body){
        console.log(flightDetailApiOptions.url);
        if(err){
            console.log(err);
        } else if (response.statusCode === 200) {
                var responseBody = JSON.parse(body);
                   console.log(responseBody);
                   
                    
                res.render('flightDetail', {title: 'Flight Detail', flightDetail: responseBody});
                
        } else {
            console.log(response.statusCode);
        }
    });
    
    
}