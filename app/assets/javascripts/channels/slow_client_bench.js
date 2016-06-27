//= require cable
//= require_self
//= require_tree .

this.App = {
  last_delay: 0
};

App.cable = ActionCable.createConsumer();

App.timestamps= App.cable.subscriptions.create('SlowClientBenchmarkChannel', {
  received: function(data) {
    if (data.time) {
      var now = Math.round(new Date());
      var then = Math.round(data.time*1000.0);
      console.log("Difference", now - then);
    }
  },

  renderMessage: function(data) {
  }
});
