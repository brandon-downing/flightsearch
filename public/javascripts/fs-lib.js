var FS = {
	populateOrigDest: function(){
		if (typeof departureAirport !== 'undefined' && typeof arrivalAirport !== 'undefined'){
			$('#origin-destination').html(airportsCodesNames[departureAirport] +' - '+ airportsCodesNames[arrivalAirport]);
		}
	}, 
	
	populateAirportDropdowns: function(){
		if(typeof airportsCodesNames !== 'undefined' && $('#departureAirport') && $('#arrivalAirport'))
		$.each(airportsCodesNames, function(key, value){
			var option = '<option value="'+key+'">'+value+'</option';
			$('#departureAirport').append(option);
			$('#arrivalAirport').append(option);

		});
	}
};


$(function(){
	//functions to run on DOM ready
	FS.populateOrigDest();
	FS.populateAirportDropdowns();
});