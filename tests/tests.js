describe("Flightplan", function() {
  var fp;

  var mock_google = function() {
    return {
      computeDistanceBetween: sinon.stub().returns(100), 
      computeHeading: sinon.stub().returns(0),
      computeOffset: sinon.stub().returns(10)
    } 
  };

  beforeEach(function() {
    // Mock out the google API.
    google.maps.geometry.spherical = mock_google();
  });

  it("should initialize.", function() {
    var origin = { lat: 38.2, lng: -79.5 },  
        destination = { lat: 40.3, lng: -89.002 },  
    fp = new FlightPlan({
      origin: origin,
      destination: destination,
    });

    expect(fp.get('origin')).toBe(origin);
    expect(fp.get('destination')).toBe(destination);
    expect(fp.get('speed')).toBe(550);
    expect(fp.get('interval')).toBe(1);
  });

  it("should calculate forecast points", function() {
    var origin = { lat: 38.2, lng: -79.5 },  
        destination = { lat: 40.3, lng: -89.002 },  
    fp = new FlightPlan({
      origin: origin,
      destination: destination,
      speed: 10
    });
    fp._convertLatLng = sinon.stub().returns({lat: 0, lng: 0});
    fp.calculateRoute();
    // points should be origin, destination, and 10 steps based on mock values.
    expect(fp.get('route').length).toBe(12)
  });
});
