var SS = SS || {};
var data = {};

SS.seatingChart = function (data) {
    var $container = $('#chartContainer'),
        width = $container.width(),
        height = $container.height();

    var chart = d3.select("#chartContainer").append("svg")
        .attr("width", width)
        .attr("height", height);

    var seatwidth = 40,
        seatheihgt = 50,
        bookedcolor = '#999',
        vacantcolor = '#666',
        bookedbgcolor = '#cccccc',
        vacantbgcolor = '#ffffff',
        strokecolor = '#333333',
        selectedcolor = 'rgb(230, 230, 199)',
        offsetx = seatwidth + 5,
        offsety = 0,
        rowcount = 0,
        baycount = 0,
        seatsinrow = 3,
        
        applyOffsets = function (obj, index) {
            //console.log(obj);
            //console.log(index);
            if (index % seatsinrow === 0) {
                rowcount !== 0 ? offsety = offsety + seatheihgt + 5 : offsety;
                offsetx = 0;
                rowcount += 1;
            } else {
                offsetx = seatwidth + 5;
            }
            //console.log(offsety);
            return ('translate(' + offsetx * (index % seatsinrow) + ',' + offsety + ')');
        }, 
        
        updateSeatSelection = function () {
            var $selector = $('#selectedSeats'), 
                selectedSeats = localStorage.selectedSeats;
            $selector.find('p').remove();
            selectedSeats.length > 0 ? $selector.show() : $selector.hide();
            $selector.append('<p>' + selectedSeats.replace(/,/g, ', ' ) + '</p>');
            
        };



    data.bays.forEach(function (baydata, i, bayarray) {
        offsety = 0;
        rowcount = 0;
        baycount = i;
        var bayoffsetx = 360 + baycount * 350;


        var bay = chart.append('g').attr('class', 'bay').attr('transform', 'translate(' + bayoffsetx + ', 150)');

        var seat = bay.selectAll('.seat')
            .data(baydata)
            .enter()
            .append('g').attr('class', 'seat');

        seat.append("rect")
            .attr('fill', function (d) {
                // console.log(d);
                return d.status === 'booked' ? bookedbgcolor : vacantbgcolor;
            })
            .attr('class', function (d) {
                return d.status === 'booked' ? 'booked' : 'available';
            })
            .attr('width', seatwidth)
            .attr('height', seatheihgt)
            .attr('stroke', strokecolor)
            .attr('stroke-width', '2')
            .attr('transform', function (d, i) {
                return applyOffsets(d, i);
            })
            .on('click', function (d, i) {
                if (this.className.baseVal === 'available') {
                    if (this.style.fill !== selectedcolor) {
                        this.style.fill = selectedcolor;
                        var thisSeat = d.row + d.seat;
                        if (window.localStorage.selectedSeats.length > 0) {
                            thisSeat = ',' + thisSeat;
                        }
                        window.localStorage.selectedSeats += thisSeat;
                        updateSeatSelection();
                    } else {
                        this.style.fill = vacantbgcolor;
                        var thisSeat = d.row + d.seat,
                            selectedSeats = window.localStorage.selectedSeats.split(',');
                        selectedSeats.forEach(function (item, i) {
                            if (thisSeat === item) {
                                selectedSeats.splice(i, 1);
                                localStorage.setItem('selectedSeats', selectedSeats);
                                updateSeatSelection();
                            }

                        })

                    };

                }


            });

        //reset to default offsets before reusing for seat numbers
        offsetx = seatwidth + 5;
        offsety = 0;
        seat.append('text')
            .text(function (d) {
                return d.row + d.seat;
            }).attr('transform', function (d, i) {
                return applyOffsets(d, i);
            }).attr('font-size', '12').attr('x', '2').attr('y', '-40').attr('style', function (d, i) {
                return d.status === 'booked' ? 'stroke:' + bookedcolor : 'stroke:' + vacantcolor;
            });


    });


    //clear localStorage before interacting with the map
    window.localStorage.selectedSeats = '';
};


//on page load
$(function () {

    $.ajax({
            url: '/javascripts/data.json',
            dataType: 'json'
        })
        .done(function (data) {
            SS.seatingChart(data);
        })
        .fail(function () {
            console.log('error');

        });

});