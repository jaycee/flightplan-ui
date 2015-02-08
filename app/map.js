var MapView = Backbone.View.extend({

  id: 'page',
  tagName: 'div',
  events: {
    'submit #nav': 'update_args'
  },

  initialize: function(opts) {
    if (opts) {
      this.center = opts.center;
      this.zoom = opts.zoom;
      this.container = opts.container;
    }
  },

  update_args: function(e) {
    e.preventDefault();
    if (this.flightPath) {
      this.flightPath.setMap(null);
    }
    var src = e.target[0].value,
        dest = e.target[1].value;

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

    var flightPathCoords = [
      new google.maps.LatLng(src.lat, src.lng),
      new google.maps.LatLng(dest.lat, dest.lng)
    ];
    this.flightPath = new google.maps.Polyline({
      path: flightPathCoords,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    this.flightPath.setMap(this.g_map);
    this.g_map.setCenter(src);
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
