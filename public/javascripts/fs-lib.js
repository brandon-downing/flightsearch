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
			var option = '<option value="'+key+'">'+value+'</option>';
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
				console.log(data);
				if (data.imageUrl) {
					// $('html').css('background-image','url('+data.imageUrl+')');
					$('body').append('<img class="bgImage" src="' + data.imageUrl + '"/>');
				} else {
					$('html').css('background-image','url(/images/airplane-bg.jpg)').addClass('home');
				}
			})
			.fail(function(){
				console.warn('error');
			});
		}
	}, 
	
	populateSelectedValues: function () {
		$('#departureAirport option').each(function () {
				if ($(this).val() === localStorage.departureAirport) {
					$(this).attr('selected', 'selected');
				}
			});
			$('#arrivalAirport option').each(function () {
				if ($(this).val() === localStorage.arrivalAirport) {
					$(this).attr('selected', 'selected');
				}
			});
			
			if(localStorage.departureDate) {
				$('#datepicker').val(localStorage.departureDate); 
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
	FS.populateSelectedValues();
	
});