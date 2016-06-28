//= require cable
//= require_self
//= require_tree .

this.App = {
  last_delay: 0,
  current_delay: 0,
  peers: []
};

App.cable = ActionCable.createConsumer();

App.slow_client_benchmark = App.cable.subscriptions.create('SlowClientBenchmarkChannel', {
  received: function(data) {
    if (data.time) {
      this.processTimeMessage(data);
    }
    if (data.peers) {
      this.processPeerMessage(data);
    }
  },
  processTimeMessage: function(data) {
    this.last_delay = this.current_delay;
    var now = Math.round(new Date());
    var then = Math.round(data.time*1000.0);
    this.current_delay = now - then;
    this.renderTimeMessage();
  },
  renderTimeMessage: function() {
    $('#delay').text(this.last_delay);
    $('#delay_change').text(Math.abs(this.last_delay - this.current_delay));
  },
  processPeerMessage: function(data) {
     this.peers = data.peers;
     this.renderPeers();
  },
  renderPeers: function() {
    var peers_number = this.peers.length;
    $('#peers_number').text(peers_number);
    var renderPeer = function(peer) { return "<li>" + peer.data + "</li>"; };
    $('#peers').html(this.peers.map(renderPeer).join(""));
  }
});
