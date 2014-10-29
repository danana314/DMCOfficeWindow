(function(exports){

  // Create namespace for app-level variables
  App = {};
  App.offices = _offices;
  App.officeId = _officeId;

  function Office(id, name, isPresent) {
    var self = this;
    self.name = ko.observable(name);
    self.id = ko.observable(id);
    self.isPresent = ko.observable(isPresent);
    self.isConnected = ko.observable(false);
    self.localself
  }

  // Data model
  var OfficesViewModel = function() {
    var self = this;

    self.offices = ko.observableArray();
    for (var i = 0; i < App.offices.length; i++) {
      self.offices.push(new Office(App.offices[i].id, App.offices[i].name, App.offices[i].present));
    };

    self.changePresenceById = function(officeId, presence) {
      var firstoffice = ko.utils.arrayFirst(this.offices(), function(currentOffice) {
        return currentOffice.id() == officeId;
      });
      if (firstoffice) {firstoffice.isPresent(presence);}
    };

    self.callOffice = function(office) {
      var call = peer.call(office.id(), App.localStream);

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#remote-video').prop('src', URL.createObjectURL(stream));
      });

      call.on('close', state_idle);
    };
  };
  var officesViewModel = new OfficesViewModel();
  ko.applyBindings(officesViewModel);

  // Compatibility shim
  navigator.getUserMedia = navigator.getUserMedia
                        || navigator.webkitGetUserMedia
                        || navigator.mozGetUserMedia;

  // PeerJS object
  //aqu2ngp60qr7wrk9  // Personal API key; TODO: replace
  var peer = new Peer(App.officeId , { key: 'lwjd5qra8257b9', debug: 3, 
    config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
  ]}});

  peer.on('open', function(){
    officesViewModel.changePresenceById(peer.id, true);
  });

  // Receiving a call
  peer.on('call', function(call){
    // Answer the call automatically
    call.answer(App.localStream);
    state_call_in_progress(call);
  });
  peer.on('error', function(err){
    alert(err.message);
    // Return to idle state if error occurs
    alert('Call receive failed')
  });

  // When everything read to start
  $(function(){
    // Get audio/video stream
    navigator.getUserMedia({audio: true, video: true}, function(stream){
      // Set your video displays
      $('#local-video').prop('src', URL.createObjectURL(stream));
      App.localStream = stream;
    }, function(){ alert('Cannot access camera/mic'); });
  });


  function state_call_in_progress (call) {
    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
      $('#remote-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    call.on('close', state_idle);
  }
})(this);