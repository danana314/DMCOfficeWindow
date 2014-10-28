(function(exports){

  function Office(id, name, isPresent) {
    var self = this;
    self.name = ko.observable(name);
    self.id = ko.observable(id);
    self.isPresent = ko.observable(isPresent);
  }

  // Data model
  var OfficesViewModel = function() {
    var self = this;

    self.offices = ko.observableArray();
    for (var i = 0; i < _offices.length; i++) {
      self.offices.push(new Office(_offices[i].id, _offices[i].name, _offices[i].present));
    };

    self.changePresenceById = function(officeId, presence) {
      var firstoffice = ko.utils.arrayFirst(this.offices(), function(currentOffice) {
        return currentOffice.id() == officeId;
      });
      if (firstoffice) {firstoffice.isPresent(presence);}
    };

    self.callOffice = function(office) {
      var call = peer.call(office.id(), window.localStream);

      // Wait for stream on the call, then set peer video display
      call.on('stream', function(stream){
        $('#their-video').prop('src', URL.createObjectURL(stream));
      });

      call.on('close', state_idle);
    };

    self.changePresence1 = function() {
      var firstoffice = ko.utils.arrayFirst(this.offices(), function(currentOffice) {
        return currentOffice.id() == _officeId;
      });
      if (firstoffice) {firstoffice.isPresent(!firstoffice.isPresent());}
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
  var peer = new Peer(_officeId , { key: 'lwjd5qra8257b9', debug: 3, 
    config: {'iceServers': [
    { url: 'stun:stun.l.google.com:19302' } // Pass in optional STUN and TURN server for maximum network compatibility
  ]}});

  peer.on('open', function(){
    officesViewModel.changePresenceById(peer.id, true);
  });

  // Receiving a call
  peer.on('call', function(call){
    // Answer the call automatically
    call.answer(window.localStream);
    state_call_in_progress(call);
  });
  peer.on('error', function(err){
    alert(err.message);
    // Return to idle state if error occurs
    state_idle();
  });

  // Click handlers setup
  $(function(){

    // Start call
    $('#make-call').click(function(){
      var call = peer.call($('#callto-id').val(), window.localStream);
      state_call_in_progress(call);
    });

    // End call
    $('#end-call').click(function(){
      window.existingCall.close();
      state_idle();
    });

    // Retry if getUserMedia fails
    $('#state_setup-retry').click(function(){
      $('#state_setup-error').hide();
      state_setup();
    });

    // Get things started
    state_setup();
  });

  function state_setup () {
    $('#state_idle, #state_call_in_progress').hide();
    $('#state_setup').show();
    $('#state_setup-error').hide();

    // Get audio/video stream
    navigator.getUserMedia({audio: true, video: true}, function(stream){
      // Set your video displays
      $('#my-video').prop('src', URL.createObjectURL(stream));

      window.localStream = stream;
      state_idle();
    }, function(){ $('#state_setup-error').show(); });
  }

  function state_idle () {
    $('#state_setup, #state_call_in_progress').hide();
    $('#state_idle').show();
  }

  function state_call_in_progress (call) {
    // Hang up on an existing call if present
    if (window.existingCall) {
      window.existingCall.close();
    }

    // Wait for stream on the call, then set peer video display
    call.on('stream', function(stream){
      $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // UI stuff
    window.existingCall = call;
    $('#their-id').text(call.peer);
    call.on('close', state_idle);
    $('#state_setup, #state_idle').hide();
    $('#state_call_in_progress').show();
  }
})(this);