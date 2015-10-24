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
	$('#flight-search').on('submit', function(){
		$('.error').removeClass('error');
		if ($('#datepicker').val().length < 10){
			$('#date-container').addClass('error');
			console.log('pick a date');
			return false;
		} else if ($('#departureAirport').val() === '') {
			$('#origin-container').addClass('error');
			console.log('pick origin');
			return false;
		}else if ($('#arrivalAirport').val() === '') {
			$('#dest-container').addClass('error');
			console.log('pick destination');
			return false;
		}
	});
});