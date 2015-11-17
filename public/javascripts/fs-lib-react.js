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
						arrivalTimeFormatted = new Date(seg.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
					return (<div>
					           <div className="price">{currentOffer.totalFarePrice.formattedWholePrice}</div>
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


//check URL params, call for data and render component
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
	
			 

