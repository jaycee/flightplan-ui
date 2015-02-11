var EARTH_RADIUS = 3959;

var FlightPlan = Backbone.Model.extend({
  defaults: {
    origin: {lat: 0, lng: 0},
    destination: {lat: 0, lng: 0},
    speed: 550,  // average speed of a commercial airliner in mph
    interval: 1,  // in hours
    forecasts: []
  },

  _convertLatLng: function(coordinate) {
    return new google.maps.LatLng(coordinate.lat, coordinate.lng);
  },

  calculateRoute: function() {
    var origin = this._convertLatLng(this.get('origin')),
        destination = this._convertLatLng(this.get('destination')),
        speed = this.get('speed'),
        interval = this.get('interval');

    var distance = google.maps.geometry.spherical.computeDistanceBetween(
        origin, destination, EARTH_RADIUS);

    var interval_speed = speed * interval,
        steps = parseInt(distance / interval_speed, 10);

    var forecasts = [origin],
        start = origin;

    for(var i=0; i<steps; i++) {
      var heading = google.maps.geometry.spherical.computeHeading(start, destination);
      var point = google.maps.geometry.spherical.computeOffset(
          start, interval_speed, heading, EARTH_RADIUS);
      start = point;
      forecasts.push(point);
    }
    forecasts.push(destination);
    this.set('forecasts', forecasts);
  },

  getForecastData: function() {
    var coords = [],
        forecasts = this.get('forecasts');

    for (var i=0; i<forecasts.length; i++) {
      coords.push(forecasts[i].k);
      coords.push(forecasts[i].D);
    }
    coords = coords.join(',');
    $.ajax({
      url: 'http://localhost:6543',
      data: {coords: coords},
      success: this.updateForecastData,
      dataType: 'jsonp',
      context: this
    });
  },

  updateForecastData: function(data, statusText, xhr) {
    this.set('forecasts', data.forecasts);
  }
});
