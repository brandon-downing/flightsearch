var flightCard = React.createClass({
	displayName: 'FlightCard',
	getInitialState: function () {
		console.log(this.props.initialData);
		return {
			data: this.props.initialData
		};
	},
	_displayFlightResults: function () {
		var self = this;
		return (self.state.data.legs.map(function (flight, flightid) {
			var currLegId = flight.legId, 
			currentOffer;
			self.state.data.offers.forEach(function(offer, index, array){
				if ($.inArray(currLegId, offer.legIds) === 0) {
					currentOffer = offer;
					console.log(currentOffer);
				}
			});
			
			
			return React.DOM.section({ key: flightid, 'data-flightid': flight.legId, className: 'box' },
				flight.segments.map(function (seg, segid, segarray) {
					//console.log(seg);
					var departureTimeFormatted = new Date(seg.departureTime).toLocaleTimeString('en-US',{hour:'2-digit', minute:'2-digit'}), 
						arrivalTimeFormatted = new Date(seg.arrivalTime).toLocaleTimeString('en-US',{hour:'2-digit', minute:'2-digit'});
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
							</div>
						);
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
	
			 

