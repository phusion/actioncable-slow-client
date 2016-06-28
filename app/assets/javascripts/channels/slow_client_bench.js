//= require cable
//= require_self
//= require_tree .

this.App = {
  last_delay: 0,
  current_delay: 0
};

App.cable = ActionCable.createConsumer();

App.timestamps = App.cable.subscriptions.create('SlowClientBenchmarkChannel', {
  received: function(data) {
    if (data.time) {
      this.processTimeMessage(data);
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
  }
});
