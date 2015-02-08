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
        dest = e.target[1].value,
        speed = e.target[2].value;

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
    //TODO don't hardcode speed and interval
    var points = this.get_points(flightPathCoords[0], flightPathCoords[1], 60, 2)    
    this.flightPath = new google.maps.Polyline({
      path: points,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });
    _.each(points, function(point) {
      debugger;
      var marker = new google.maps.Marker({
          position: point,
      })
      marker.setMap(this.g_map);
    });
    this.flightPath.setMap(this.g_map);
    this.g_map.setCenter(src);
  },

  get_points: function(src, dest, speed, interval) {
    var distance = google.maps.geometry.spherical.computeDistanceBetween(
        src, dest, 3959);
    var interval_speed = speed * interval;
    var steps = parseInt(distance / interval_speed, 10);
    var heading = google.maps.geometry.spherical.computeHeading(src, dest);
    var points = [src];
    for(var i=0; i<steps; i++) {
      var point = google.maps.geometry.spherical.computeOffset(
          src, interval_speed, 3959);
      points.push(point);
    }
    points.push(dest);
    return points;
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
