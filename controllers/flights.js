var request = require('request');

module.exports.home = function(req, res){
	res.render('index', { title: 'Search Flights', noNav: true});
};

module.exports.search = function(req, res){
	res.render('search', { title: 'Search Flights', noNav: true});
};

module.exports.find = function(req, res){
	res.render('search-flex', { title: 'Find Flights', noNav: true});
};

module.exports.badging = function(req, res){
	res.render('badging', { title: 'Find Flights', noNav: true});
};

module.exports.findarea = function(req, res){
	res.render('findarea', { title: 'Find Area'});
};

module.exports.seatingMap = function(req, res){
	res.render('seating-map', { title: 'Seating Map', noNav: true});
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
                flightOffers = [], 
                formattedDD = new Date(departureDate).toUTCString();
                formattedDD = formattedDD.substr(0, formattedDD.length - 13);  
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
                departureDate: departureDate, formattedDepartureDate: formattedDD, departureAirport: departureAirport, arrivalAirport: arrivalAirport });
    		
    } else {
        console.log(response.statusCode);
    }
});
	
};

module.exports.results = function (req, res) {
    var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport;
    res.render('results', {title: 'Flights', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport});
};

module.exports.resultsflex = function (req, res) {
    var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport;
    res.render('results-flex', {title: 'Flights', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport, isFlex: true});
};

module.exports.resultsbadging = function (req, res) {
    var departureDate = req.query.departureDate,
		departureAirport = req.query.departureAirport,
		arrivalAirport = req.query.arrivalAirport;

    var url = 'http://terminal2.expedia.com:80/x/flights/v3/search/1/' + departureAirport +'/' + arrivalAirport +'/' + departureDate +'?apikey=LhhGvIMEeKyxkApP38RSq5kz810l8gLT';

    //call trends API on the server
    var trends =  '';
        request({url: url, method: 'GET'}, function(err, response, body){

        if(err){
            console.log(err);
        } else if (response.statusCode === 200) {
                var responseBody = JSON.parse(body);
                    trends =  JSON.stringify(responseBody);
        res.render('results-badging', {title: 'Flights', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport, isFlex: true, isBadging: true, trends: trends});
        } else {
            console.log(response.statusCode);
        }
    });










};

module.exports.details = function (req, res) {
    var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport, 
        productKey = req.query.productKey;
    res.render('details', {title: 'Flight Details', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport, productKey: productKey});
};

module.exports.detailsflex = function (req, res) {
    var departureDate = req.query.departureDate, 
		departureAirport = req.query.departureAirport, 
		arrivalAirport = req.query.arrivalAirport, 
        productKey = req.query.productKey;
    res.render('details-flex', {title: 'Flight Details', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport, productKey: productKey, isFlex: true});
};

module.exports.detailsbadging = function (req, res) {
    var departureDate = req.query.departureDate,
		departureAirport = req.query.departureAirport,
		arrivalAirport = req.query.arrivalAirport,
        productKey = req.query.productKey;
    res.render('details-badging', {title: 'Flight Details', departureDate: departureDate, departureAirport: departureAirport, arrivalAirport: arrivalAirport, productKey: productKey, isFlex: true, isBadging: true});
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
                var responseBody = JSON.parse(body),
                formattedDD = new Date(departureDate).toUTCString();
                formattedDD = formattedDD.substr(0, formattedDD.length - 13);    
                res.render('flightDetail', {title: 'Flight Detail', flightDetail: responseBody, departureAirport: departureAirport, 
                    arrivalAirport: arrivalAirport, departureDate: formattedDD});
                
        } else {
            console.log(response.statusCode);
        }
    });
    
    
}
