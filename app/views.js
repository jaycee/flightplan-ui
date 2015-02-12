var MapView = Backbone.View.extend({

  id: 'page',
  tagName: 'div',
  events: {
    'submit #nav': 'updateArgs',
    'click a#prev': 'previousForecast',
    'click a#next': 'nextForecast',
    'click a#reset': 'reset'
  },

  initialize: function(args) {
    if (args) {
      this.center = args.center;
      this.zoom = args.zoom;
    }
  },

  updateArgs: function(e) {
    e.preventDefault();
    if (this.flightPath) {
      this.flightPath.setMap(null);
    }

    var src = e.target[0].value,
        dest = e.target[1].value,
        speed = parseFloat(e.target[2].value, 10),
        interval = parseFloat(e.target[3].value, 10);
    src = src.split(',');
    dest = dest.split(',');
    src = {
      lat:  parseFloat(src[0]),
      lng:  parseFloat(src[1])
    };
    dest = {
      lat:  parseFloat(dest[0]),
      lng:  parseFloat(dest[1])
    };

    this.model.set({
      origin: src,
      destination: dest,
      speed: speed,
      interval: interval
    });

    this.model.on('forecastUpdated', this.drawRoute, this);
    this.model.calculateRoute();
    this.model.getForecastData();
  },

  render: function() {
    var mapOptions = {
      center: this.center,
      zoom: this.zoom
    };
    var container = this.$('#map-canvas')[0];
    this.g_map = new google.maps.Map(container, mapOptions);
    var template = _.template($("script#input_controls").html());
    $('#controls').append(template());
  },

  nextForecast: function(e) {
    e.preventDefault();
    this.current_idx += 1;
    this.showForecast();
  },

  previousForecast: function(e) {
    e.preventDefault();
    this.current_idx -= 1;
    this.showForecast();
  },

  showForecast: function() {
    if(this.marker) {
      this.marker.setMap(null);
    }
    $('#controls').empty();
    var template = _.template($("script#forecast_controls").html());
    var route = this.model.get('route');
    var forecastData = this.model.get('forecasts');
    var point = route[this.current_idx];
    var forecast = forecastData[this.current_idx][1];
    var html = template({
      lat: point.k.toFixed(3),
      lng: point.D.toFixed(3),
      temperature: forecast.temperature,
      humidity: forecast.humidity,
      windSpeed: forecast.windSpeed,
      windBearing: forecast.windBearing,
      precipProbability: forecast.precipProbability,
      precipType: forecast.precipType,
      isFirst: (this.current_idx === 0),
      isLast: (this.current_idx === route.length - 1)
    });
    $('#controls').append(html);
    this.marker = new google.maps.Marker({
        position: point,
        map: this.g_map,
    });
    this.g_map.setCenter(point);
  },

  drawRoute: function() {
    var path = this.model.get('route');
    this.flightPath = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    this.flightPath.setMap(this.g_map);
    this.current_idx = 0;
    this.showForecast();
  },

  reset: function(e) {
    e.preventDefault();
    if(this.marker) {
      this.marker.setMap(null);
    }
    if(this.flightPath) {
      this.flightPath.setMap(null);
    }
    $('#controls').empty();
    var template = _.template($("script#input_controls").html());
    $('#controls').append(template());
    this.model.set(this.model.defaults);
  }
});
