(function() {

  define([], function() {
    console.log("engine-paint");
    return {
      scene_pool: [],
      update: function(scene_pool, prefn) {
        var i;
        scene_pool.length && prefn();
        scene_pool = scene_pool.sort(function(a, b) {
          return b.zIndex - a.zIndex;
        });
        i = scene_pool.length;
        while (--i >= 0) {
          (scene_pool.pop())();
        }
        return [];
      },
      paint: function(params) {
        var ctx, h, img, w, x, y;
        x = params.x;
        y = params.y;
        w = params.w;
        h = params.h;
        img = params.img;
        ctx = params.ctx;
        ctx.drawImage(img, x, y);
        return this;
      },
      clear: function(params) {
        var canvas, ctx;
        canvas = params.canvas;
        ctx = params.ctx;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return this;
      },
      chkInRect: function(params) {
        var ch, cw, h, w, x, y;
        cw = params.cw;
        ch = params.ch;
        x = params.x;
        y = params.y;
        w = params.w;
        h = params.h;
        return (x * (x - cw) <= 0 && (y * (y - ch) <= 0)) || ((x + w) * (x + w - cw) <= 0 && (y + h) * (y + h - ch) <= 0);
      }
    };
  });

}).call(this);
