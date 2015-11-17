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
			flightDetail = self.getInitialState().data;
			console.log(flightDetail);
		var _showPricing = function(){
			return (<section className="price-detail">
					<p>Total: <strong className="total">{flightDetail.offer.totalFarePrice.formattedWholePrice}</strong></p>
					<p>Base: {flightDetail.offer.baseFarePrice.formattedWholePrice}</p><p>Taxes: {flightDetail.offer.taxesPrice.formattedWholePrice}</p>
				</section>);
		},
		 _showFlightLegs = function () {
			 //console.log(flightDetail.legs);
			
			return(flightDetail.legs.map(function(leg, legid){
			
				return(leg.segments.map(function(seg, segid){
					
					return (<section className="leg">
								<p><strong>{seg.departureAirportLocation.replace(/, USA/,'')}</strong><span>&ndash;&nbsp; </span><strong>Dallas</strong><span>&nbsp;(12/25/2015)</span></p>
								<p>Spirit Airlines, Airbus A319, coach</p>
								<p>Departs: 9:15 AM</p><p>Arrives: 11:48 AM</p>
								<p>Duration: 2h 33m</p>
								<p>Total distance: 799 miles</p>
							</section>);
				})
				);
				
					
							
					
				})
				);
		};
		
		return (
			 _showPricing(),  _showFlightLegs()
			
				);
				
				
				
				
				
				/*
				<section className="leg">
					<p><strong>Dallas </strong><span>&ndash;&nbsp; </span><strong>New Orleans</strong><span>&nbsp;(12/25/2015)</span></p>
					<p>Spirit Airlines, Airbus A319, coach</p><p>Departs: 12:28 PM</p><p>Arrives: 1:50 PM</p><p>Duration: 1h 22m</p><p>Total distance: 448 miles</p>
				</section>*/
				

	}, 
	render: function() {
		return (React.DOM.div(null, this._displayDetail()));
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
}

	
			 

