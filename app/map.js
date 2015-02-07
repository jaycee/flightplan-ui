var MapView = Backbone.View.extend({
  initialize: function(opts) {
    if (opts) {
      this.center = opts.center;
      this.zoom = opts.zoom;
      this.container = opts.container;
    }
  },   

  render: function() {
    var mapOptions = {
      center: this.center,
      zoom: this.zoom 
    };
    var g_map = new google.maps.Map(this.container, mapOptions);
  }
});
