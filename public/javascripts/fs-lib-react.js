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

		return (_sortedData.legs.map(function (flight, flightid) {
			var currentOffer = _sortedData.offers[flightid];

			return React.DOM.section({ key: flightid, 'data-flightid': flight.legId, className: 'box' },
				flight.segments.map(function (seg, segid, segarray) {
					//console.log(seg);
					var departureTimeFormatted = new Date(seg.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
						arrivalTimeFormatted = new Date(seg.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
						detailUrl = 'details?departureDate='+departureDate+'&departureAirport='+ departureAirport +
							'&arrivalAirport='+ arrivalAirport +'&productKey='+currentOffer.productKey;
					return (<div>
					           <div className="price">{currentOffer.totalFarePrice.formattedWholePrice}</div>
							   <a href={detailUrl}>
							   		<button className="select-flight"> select</button>
								</a>
								<span className="airline">{seg.airlineName}</span>
								<p className="flight-leg">
									<strong>{seg.departureAirportLocation.replace(/\,\ USA/g, '')}</strong>
									<span className="time">({departureTimeFormatted})</span>
									 &nbsp;&ndash;&nbsp;
									<strong>{seg.arrivalAirportLocation.replace(/\,\ USA/g, '')}</strong>
									<span className="time">({arrivalTimeFormatted})</span>
								</p>
							</div>);
				})
				);
		}));
	},
	render: function () {
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

var isResults = $('#flightResults').length > 0, 
	isDetails = $('#flightDetails').length > 0;
//check URL params, call for data and render component

if (isResults){
	var hasParams = departureDate.length > 0 && departureAirport.length > 0 && arrivalAirport.length > 0,
	url = "https://www.expedia.com:443/api/flight/search?departureDate=" + departureDate + "&departureAirport=" + departureAirport + "&arrivalAirport=" + arrivalAirport;
if (hasParams) {
	$.ajax({
		url: url,
		dataType: 'json'
				})
		.done(function (data) {
			React.render(React.createElement(flightCard, {
				initialData: data
			}),
				document.getElementById('flightResults'));
		})
		.fail(function () {
			console.log('error');
		});
	}
} else if (isDetails) {
	var hasParams = departureDate.length > 0 && departureAirport.length > 0 && arrivalAirport.length > 0 && productKey.length > 0,
    	url = 'https://www.expedia.com:443/api/flight/details?departureDate='+ departureDate +'&departureAirport='+ departureAirport +'&arrivalAirport='+ arrivalAirport +'&productKey='+ productKey;

if (hasParams) {
			$.ajax({
				url: url,
				dataType: 'json'
			})
				.done(function (data) {
					React.render(React.createElement(flightDetail, {
						initialData: data
					}),
						document.getElementById('flightDetails'));
				})
				.fail(function () {
					console.log('error');
				});
		}
		$('menu a.navlink').attr('href', '/search');
}

	
			 

