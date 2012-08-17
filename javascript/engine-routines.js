(function() {

  define([], function() {
    var routines;
    console.log("engine-routines");
    routines = {
      jump: function() {
        return this;
      },
      preload: function() {
        return this;
      },
      requstAnima: function() {
        return this;
      },
      tick: function() {
        return this;
      },
      sortActor: function(actors) {
        actors = actors.sort(function(a, b) {
          return a.zIndex - b.zIndex;
        });
        return actors;
      }
    };
    return routines;
  });

}).call(this);
