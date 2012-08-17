(function() {

  require(["engine-main"], function(E_MODEL) {
    console.log("engine-settings");
    console.log(E_MODEL);
    return Backbone.View.extend({
      initialize: function() {
        return this;
      },
      events: {}
    });
  });

}).call(this);
