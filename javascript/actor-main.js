(function() {

  define(["engine-paint", "engine-actor", "imgs-main"], function(E_PAINT, E_ACTOR, IMGS) {
    var animaStack, canvas, cat, ctx, nextFrame, timmer, url, _imgs;
    console.log("actor-main");
    url = "images-raw/";
    _imgs = (function(IMGS) {
      var i, result, _imgi;
      _imgs = {};
      for (i in IMGS) {
        _imgi = IMGS[i];
        result = {};
        _imgi.map(function(_pathi) {
          var _img;
          _img = new Image();
          _img.src = url + _pathi + ".png";
          return result[_pathi] = _img;
        });
        _imgs[i] = result;
      }
      return _imgs;
    })(IMGS);
    self.IMG_INF = _imgs;
    canvas = $("#scene").get(0);
    ctx = canvas.getContext("2d");
    cat = new E_ACTOR({
      canvas: canvas,
      ctx: ctx,
      id: "cat",
      w: 69,
      h: 51,
      x: 0,
      y: 0,
      imgs: _imgs.cat,
      zIndex: 1,
      statusInfo: {
        walk: {
          imgIds: ['cat/walk-1', 'cat/walk-2', 'cat/walk-3', 'cat/walk-4', 'cat/walk-5', 'cat/walk-6', 'cat/walk-7', 'cat/walk-8'],
          speed: 80,
          evts: {
            finish: function(actor, e) {}
          }
        },
        sit: {
          imgIds: ["cat/sit-body"],
          inners: {
            head: {
              w: 48,
              h: 51,
              x: 0,
              y: 0,
              statusInfo: {
                move: {
                  speed: 150,
                  imgIds: ["cat/sit-head-1", "cat/sit-head-2", "cat/sit-head-3", "cat/sit-head-4", "cat/sit-head-5", "cat/sit-head-6", "cat/sit-head-7", "cat/sit-head-8", "cat/sit-head-9"],
                  evts: {
                    finish: function(actor, e) {}
                  }
                }
              }
            },
            tail: {
              w: 48,
              h: 51,
              x: 0,
              y: 0,
              statusInfo: {
                move: {
                  speed: 150,
                  imgIds: ["cat/sit-tail-1", "cat/sit-tail-2", "cat/sit-tail-3", "cat/sit-tail-4", "cat/sit-tail-5", "cat/sit-tail-6"],
                  evts: {
                    finish: function(actor, e) {}
                  }
                }
              }
            }
          },
          evts: {
            init: function(actor, e, params) {
              var head, tail;
              head = actor.find("head");
              head.anima({
                actId: "move",
                cb: function(actor) {
                  return animaStack.push(actor);
                }
              });
              tail = actor.find("tail");
              return tail.anima({
                actId: "move",
                cb: function(actor) {
                  return animaStack.push(actor);
                }
              });
            },
            finish: function(actor, e) {
              return animaStack.pop();
            }
          }
        }
      }
    });
    animaStack = [];
    cat.anima({
      actId: "sit",
      cb: function(actor) {
        return animaStack.push(actor);
      }
    });
    window.requestAnimationFrame = (function() {
      return window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, delay) {
        return window.setTimeout(callback, delay);
      };
    })();
    window.cancelRequestAnimFrame = (function() {
      return window.cancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout;
    })();
    timmer = null;
    nextFrame = function() {
      if (timmer != null) cancelRequestAnimFrame(timmer);
      return animaStack.length && (timmer = requestAnimationFrame(function() {
        var isIdle;
        isIdle = true;
        animaStack.forEach(function(actor) {
          return actor.chkIdle(timmer) && (isIdle = false, false);
        });
        !isIdle && ctx.clearRect(0, 0, canvas.width, canvas.height);
        animaStack.forEach(function(actor) {
          return actor.tick(timmer);
        });
        E_PAINT.scene_pool = E_PAINT.update(E_PAINT.scene_pool);
        return nextFrame();
      }));
    };
    nextFrame();
    self.nextFrame = nextFrame;
    return $("#stop").click(function() {
      return cancelRequestAnimFrame(timmer);
    });
  });

}).call(this);
