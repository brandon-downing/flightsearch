var flightCard = React.createClass({
	displayName: 'FlightCard',
	getInitialState: function () {
		//console.log(this.props.initialData);
		return {
			data: this.props.initialData
		};
	},

	_sortOffers: function () {
		var self = this,
			_sortedOffers = [],
			_sortedLegs = [];

		self.state.data.offers.map(function (offer, offerid) {
			offer.legIds.forEach(function (legid) {
				self.state.data.legs.map(function (leg) {
					if (legid === leg.legId) {
						_sortedLegs.push(leg);
						_sortedOffers.push(offer);
					}

				});
			});
		});
		return ({ offers: _sortedOffers, legs: _sortedLegs });
	},

	_displayFlightResults: function () {
		var self = this;
		var _sortedData = this._sortOffers();
		
		
		return (_sortedData.legs.map( function (flight, flightid) {
            var currentOffer = _sortedData.offers[flightid], 
			
                flightDepartureTime = new Date(flight.segments[0].departureTime).getTime(),
                flightArrivaltime = new Date(flight.segments[flight.segments.length - 1].arrivalTime).getTime(),
                flightDuration = flightArrivaltime - flightDepartureTime,
                stops = flight.segments.length-1, 
                flightDistance = 0, 
                seats = currentOffer.seatsRemaining,
                detailspage = isFlex ? 'details-flex' : 'details';

            if(typeof isBadging !== 'undefined' && isBadging) {
                detailspage = 'details-badging';
            }

            var detailUrl = detailspage + '?departureDate='+departureDate+'&departureAirport='+ departureAirport +
							'&arrivalAirport='+ arrivalAirport +'&productKey='+currentOffer.productKey;

			var price = currentOffer.totalFarePrice.formattedPrice.split('.');
			var formattedPrice = <div>
									{price[0]}
									<sup className="cents">.{price[1]}</sup>
								</div>; 

			return(React.DOM.section({ key: flightid, 'data-flightid': flight.legId, className: 'box' },

                React.DOM.div({className: 'price'}, formattedPrice),
                React.DOM.a({href: detailUrl }, React.DOM.button({className: 'select-flight btn-secondary btn-action t-select-btn'}, 'Select')),

				flight.segments.map(function (seg, segid, segarray) {
                
					var departureTime = seg.departureTime, 
                        duration = seg.duration,
                        distance = seg.distance,
                        departureTimeFormatted = new Date(seg.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
						arrivalTimeFormatted = new Date(seg.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
						airlineLogo = 'images/' + seg.airlineCode + '_sq.jpg';

                
                //flightDuration += duration;
                flightDistance += distance;
                
                return (<div className="segment">
                        	<img src={airlineLogo} alt={seg.airlineName} className="airlineLogo" />
							<p className="flight-leg">
								<span className="col">
									<strong>{seg.departureAirportLocation.replace(/\,\ USA/g, '')}</strong>
									<span className="icon icon-arrow90"></span>
									<strong>{seg.arrivalAirportLocation.replace(/\,\ USA/g, '')}</strong>
									<span className="airline">{seg.airlineName}</span>
								</span>
								<span className="col times">
									<span className="time">{departureTimeFormatted}</span>
									 &nbsp;&ndash;&nbsp;
									<span className="time">{arrivalTimeFormatted}</span>
								</span>
							</p>
						</div>);
				}),

                React.DOM.div({className: 'badges', 'data-distance': flightDistance, 'data-stops': stops, 'data-seats': seats, 'data-flightid': flight.legId,
                          'data-price': currentOffer.totalFarePrice.amount, 'data-time': flightDepartureTime, 'data-duration': flightDuration},'')
				));
		}));
	},
	render: function () {
		$('.bgImage').addClass('shown');
		return (
			React.DOM.div(null, this._displayFlightResults())
			);
	}
});

var flightDetail = React.createClass({
		displayName: 'FlightDetail',
	getInitialState: function () {
		return {
			data: this.props.initialData
		};
	},
	_displayDetail: function (){
		var self = this, 
			flightDetail = self.getInitialState().data, 
		
		
		 _showFlightLegs = function () {
			 //console.log(flightDetail.legs);
			
			return(flightDetail.legs.map(function(leg, legid){
				var cabinCode = flightDetail.offer.segmentAttributes[0][0]['cabinCode'];
			
				return(leg.segments.map(function(seg, segid){
					var dptTime = new Date(seg.departureTime).toLocaleTimeString('en-US',{hour:'2-digit', minute:'2-digit'}), 
						arrTime = new Date(seg.arrivalTime).toLocaleTimeString('en-US',{hour:'2-digit', minute:'2-digit'}), 
						freeCancellation = leg.freeCancellationBy ? 'Free cancellation by: ' +leg.freeCancellationBy.localized : '';
					
					return (<div>
							<section className="leg">
								<p><strong>{seg.departureAirportLocation.replace(/, USA/,'')}</strong><span>&ndash;&nbsp; </span>
								<strong>{seg.arrivalAirportLocation.replace(/, USA/,'')}</strong><span>&nbsp;({new Date(seg.departureTimeRaw).toLocaleDateString()})</span></p>
								<p>{seg.airlineName}, &nbsp;{seg.equipmentDescription}, &nbsp; {cabinCode}
								</p>
								<p>Departs: &nbsp;{dptTime}</p>
								<p>Arrives: &nbsp;{arrTime}</p>
								<p>Duration: &nbsp;{seg.duration.substr(2).replace(/H/,'h ').replace(/M/,'m')}</p>
								<p>Total distance: &nbsp;{seg.distance} &nbsp;{seg.distanceUnits}</p>
							</section>
							<p>{freeCancellation}</p>
							</div>
							);
				}));
				
				}));
		};
			
		return _showFlightLegs();
	},
	
	_showPricing: function(){
		var self = this, 
			flightDetail = self.getInitialState().data;
			return (<section className="price-detail">
					<p>Total:&nbsp;<strong className="total">{flightDetail.offer.totalFarePrice.formattedWholePrice}</strong></p>
					<p>Base:&nbsp;{flightDetail.offer.baseFarePrice.formattedWholePrice}</p>
					<p>Taxes:&nbsp;{flightDetail.offer.taxesPrice.formattedWholePrice}</p>
				</section>);
		},
		
	render: function() {
		return React.DOM.div(null, this._showPricing(), this._displayDetail());
	}
});



var applyBadges = function(){

	var lowestPrice, badgePriceRedEye, badgePriceMorning, badgePriceAfternoon, badgePriceEvening, badgePriceNonStop, badgePriceOneStop, badgeSeats, cheapestRedEye, cheapestMorning, cheapestAfternoon, cheapestEvening, cheapestNonStop, cheapestOneStop, mostSeatsRemaining, badgeLowestTrendedPrice, shortestFlight, shortestFlightBadge;

    var $badges = $('.badges');

	$badges.each(function(index, item){
        var time = new Date($(item).attr('data-time')),
            stops = parseInt($(item).attr('data-stops')),
            seats = parseInt($(item).attr('data-seats')),
            distance = parseInt($(item).attr('data-distance')),
            price = parseFloat($(item).attr('data-price')),
            duration = parseInt($(item).attr('data-duration'));

        var timeRedEye = new Date(time);
            timeRedEye.setHours(4);
            timeRedEye.setMinutes(59);
        var timeMorning = new Date(time);
            timeMorning.setHours(11);
            timeMorning.setMinutes(59);
        var timeAfternoon = new Date(time);
            timeAfternoon.setHours(17);
            timeAfternoon.setMinutes(59);
        var timeEvening = new Date(time);
            timeEvening.setHours(23);
            timeEvening.setMinutes(59);


        //lowest price
        if(lowestPrice === undefined || price < lowestPrice) {
            lowestPrice = parseFloat(price);
        }

        //shortest flight
        if(shortestFlight === undefined || duration < shortestFlight) {
            shortestFlight = parseFloat(duration);
            shortestFlightBadge = $(item).attr('data-flightid');

        }


        //determine cheapest redeye flight
        if (time.getTime() <= timeRedEye.getTime()) {
            if(badgePriceRedEye === undefined || badgePriceRedEye >= price) {
              cheapestRedEye = $(item).attr('data-flightid');
                badgePriceRedEye = price;
            }
       }

        //determine cheapest morning flight
        if (time.getTime() <= timeMorning.getTime() && time.getTime() > timeRedEye.getTime()) {
            if(badgePriceMorning === undefined || badgePriceMorning >= price) {
              cheapestMorning = $(item).attr('data-flightid');
                badgePriceMorning = price;
            }
       }

        //determine cheapest afternoon flight
        if (time.getTime() <= timeAfternoon.getTime() && time.getTime() > timeMorning.getTime()) {
            if(badgePriceAfternoon === undefined || badgePriceAfternoon >= price) {
              cheapestAfternoon = $(item).attr('data-flightid');
                badgePriceAfternoon = price;
            }
       }

        //determine cheapest evening flight
        if (time.getTime() <= timeEvening.getTime() && time.getTime() > timeAfternoon.getTime()) {
            if(badgePriceEvening === undefined || badgePriceEvening >= price) {
              cheapestEvening = $(item).attr('data-flightid');
                badgePriceEvening = price;
            }
       }

        //determine cheapest non-stop flight
        if(stops === 0) {
            if(badgePriceNonStop === undefined || price <= badgePriceNonStop){
                badgePriceNonStop = price;
                cheapestNonStop = $(item).attr('data-flightid');
            }
        }

        //determine cheapest one-stop flight
        if(stops === 1) {
            if(badgePriceOneStop === undefined || price <= badgePriceOneStop){
                badgePriceOneStop = price;
                cheapestOneStop = $(item).attr('data-flightid');
            }
        }

        //determine the flight with most seats
        if (badgeSeats === undefined || seats > badgeSeats) {
            badgeSeats = seats;
            mostSeatsRemaining = $(item).attr('data-flightid');
        }

    });

    findTrends(lowestPrice);

    $('.badges[data-flightid="'+ cheapestRedEye +'"]').append('<span class="cheapest-redeye">Cheapest red eye!</span>');
    $('.badges[data-flightid="'+ cheapestMorning +'"]').append('<span class="cheapest-morning">Cheapest morning flight!</span>');
    $('.badges[data-flightid="'+ cheapestAfternoon +'"]').append('<span class="cheapest-afternoon">Cheapest afternoon flight!</span>');
    $('.badges[data-flightid="'+ cheapestEvening +'"]').append('<span class="cheapest-evening">Cheapest evening flight!</span>');
    $('.badges[data-flightid="'+ cheapestNonStop +'"]').append('<span class="cheapest-nonstop">Cheapest non-stop flight!</span>');
    $('.badges[data-flightid="'+ cheapestOneStop +'"]').append('<span class="cheapest-onestop">Cheapest one-stop flight!</span>');
    $('.badges[data-flightid="'+ mostSeatsRemaining +'"]').append('<span class="most-seats">Emptiest flight!</span>');

    if(findTrends){
        $('.badges:eq(0)').append('<span class="best-trended">One of the cheapest this week!</span>');
    }

    $('.badges[data-flightid="'+ shortestFlightBadge +'"]').append('<span class="shortest-flight">This is the shortest flight!</span>');



};// end applyBadges


var findTrends = function (lowestPrice){
if (currentTrends) {

        //var prediction = currentTrends.recommended.predictionNextWeek.prediction;
       // var movement = prediction > 0 ? 'increase' : 'drop';
        //console.log('If you were to wait a week, the price may ' + movement+ ' by ' + prediction);

        var trendedMedianPrice = currentTrends.recommended.trends.slice(0, 7).reduce(getLowest).median;

        function getLowest (previousValue, currentValue) {
            return parseInt(previousValue.median) < parseInt(currentValue.median) ?  previousValue : currentValue
        }

        console.log(typeof lowestPrice);
            console.log(typeof trendedMedianPrice);

        if (lowestPrice < parseFloat(trendedMedianPrice) * 1.1) {
            return true;//badgeLowestTrendedPrice = $(item).attr('data-flightid');
        }
    }
};

var isResults = $('#flightResults').length > 0, 
	isDetails = $('#flightDetails').length > 0;
//check URL params, call for data and render component

if (isResults){
	//console.log('isResults');
	var hasParams = departureDate.length > 0 && departureAirport.length > 0 && arrivalAirport.length > 0,
	url = "https://www.expedia.com:443/api/flight/search?departureDate=" + departureDate + "&departureAirport=" + departureAirport + "&arrivalAirport=" + arrivalAirport;
if (hasParams) {
	localStorage.setItem('departureDate', departureDate);
	localStorage.setItem('departureAirport', departureAirport);
	localStorage.setItem('arrivalAirport', arrivalAirport);
	$('img.loader').show();
	$.ajax({
		url: url,
		dataType: 'json'
				})
		.done(function (data) {
			$('img.loader').hide();
			React.render(React.createElement(flightCard, {
				initialData: data
			}),
				document.getElementById('flightResults'));
				
				applyBadges();
                //findTrends();
	
			
		})
		.fail(function () {
			console.log('error');
			$('img.loader').hide();
		});
	}
} else if (isDetails) {
	console.log('isDetails');
	var hasParams = departureDate.length > 0 && departureAirport.length > 0 && arrivalAirport.length > 0 && productKey.length > 0,
    	url = 'https://www.expedia.com:443/api/flight/details?departureDate='+ departureDate +'&departureAirport='+ departureAirport +'&arrivalAirport='+ arrivalAirport +'&productKey='+ productKey;

if (hasParams) {
	$('img.loader').show();
			$.ajax({
				url: url,
				dataType: 'json'
			})
				.done(function (data) {
					React.render(React.createElement(flightDetail, {
						initialData: data
					}),
						document.getElementById('flightDetails'));
						$('img.loader').hide();
						$('#flightDetails').addClass('flex-container');
				})
				.fail(function () {
					console.log('error');
					$('img.loader').hide();
				});
		}
		if (!isFlex) {
			$('menu a.navlink').attr('href', '/search');
		}
}

	
			 

