var MapView = Backbone.View.extend({

  id: 'page',
  tagName: 'div',
  events: {
    'submit #nav': 'updateArgs'
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

    var fp = new FlightPlan({
      origin: src,
      destination: dest,
      speed: speed,
      interval: interval
    });

    fp.calculateRoute();
    this.flightPath = new google.maps.Polyline({
      path: fp.get('forecasts'),
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    var origin = fp.get('forecasts')[0];
    new google.maps.Marker({
        position: origin,
        map: this.g_map,
    });
    this.flightPath.setMap(this.g_map);
    this.g_map.setCenter(origin);
    fp.getForecastData();
  },

  render: function() {
    var mapOptions = {
      center: this.center,
      zoom: this.zoom
    };
    var container = this.$('#map-canvas')[0];
    this.g_map = new google.maps.Map(container, mapOptions);
  }
});
