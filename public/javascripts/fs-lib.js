var FS = {
	imageSize: {width: 720, height: 1140},
	
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
	}, 
	getImage: function () {
		if (typeof arrivalAirport !== 'undefined') {
			$.ajax({
				url:'https://www.expedia.com:443/api/flight/image?destinationCode=' + arrivalAirport + 
					'&imageWidth=' + this.imageSize.width +
					'&imageHeight=' +this.imageSize.height, 
				dataType: 'json'
			}).done(function(data){
				 if($('.backgroundImage').length > 0) {
					$('.backgroundImage').css('background-image','url('+data.imageUrl+')');
				}
			})
			.fail(function(){
				console.warn('error');
			});
		}
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
	FS.getImage();
	
});