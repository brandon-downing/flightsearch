var FS = {
	populateOrigDest: function(){
		$('#origin-destination').html(airportsCodesNames[departureAirport] +' - '+ airportsCodesNames[arrivalAirport]);
	}
};


$(function(){
	FS.populateOrigDest();
});