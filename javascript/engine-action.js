(function() {

  define(["vender/jq-easing"], function() {
    var ACTION;
    console.log("engine-action");
    return ACTION = Backbone.Model.extend({
      initialize: function(params) {
        var _ref, _ref2, _ref3, _ref4;
        this.set({
          count: 0,
          times: (_ref = params.times) != null ? _ref : params.times = 0,
          start_time: params.start_time || 0,
          target: (_ref2 = params.target) != null ? _ref2 : params.target = [0, 0],
          speed: (_ref3 = params.speed) != null ? _ref3 : params.speed = 1,
          ease: (_ref4 = params.easing) != null ? _ref4 : params.easing = "linear",
          cache: {
            imgId: ""
          }
        });
        this.valid_input(params);
        this.on("init during finish", function(params) {
          var _act;
          _act = this;
          return _act.trigger_customEvts(params);
        }, this);
        return this;
      },
      valid_input: function(params) {
        var duration, end_time, evts, imgIds, imgs_num, life_cycle, show_img, speed, start_time, tmp, _IMG_INF, _canvas, _ctx, _inners, _momId, _ref, _ref2, _tmp_inners;
        start_time = this.get("start_time");
        end_time = (this.get("end_time")) || start_time + (this.get("duration") || 0);
        duration = Math.abs(start_time - end_time);
        speed = this.get("speed");
        imgIds = this.get("imgIds");
        imgs_num = imgIds.length;
        life_cycle = imgs_num * speed;
        tmp = (_ref = params.evts) != null ? _ref : params.evts = {};
        if (tmp.init == null) tmp.init = function(actor, e) {};
        if (tmp.during == null) tmp.during = function(actor, e) {};
        if (tmp.finish == null) tmp.finish = function(actor, e) {};
        _IMG_INF = IMG_INF;
        show_img = function(actor, act, _IMG_INF, img_id) {
          var _img;
          _img = act.get_img({
            img_inf: _IMG_INF,
            actor_id: actor.get("id"),
            img_id: img_id
          });
          return function() {
            return actor.show_img({
              img: _img
            });
          };
        };
        evts = {
          init: function(actor, act, e, params) {
            var fn, img_id;
            img_id = imgIds[~~(params.dt / speed)];
            act.set("cache", {
              img_id: img_id
            });
            fn = show_img(actor, act, _IMG_INF, img_id);
            fn.zIndex = actor.get("zIndex");
            params.cb(fn);
            tmp.init(actor, e, params);
            return actor;
          },
          during: function(actor, act, e, params) {
            var count, dt, fn, img_id;
            dt = params.dt;
            count = act.get("count");
            dt - life_cycle >= 0 && (count++, act.set("count", count), dt -= life_cycle);
            img_id = imgIds[~~(dt / speed)];
            act.set("cache", {
              img_id: img_id
            });
            fn = show_img(actor, act, _IMG_INF, img_id);
            fn.zIndex = actor.get("zIndex");
            params.cb(fn);
            tmp.during(actor, e, params);
            return actor;
          },
          finish: function(actor, act, e, params) {
            var count, dt, fn, img_id, isFinish, times;
            times = act.get("times");
            count = act.get("count");
            duration = act.get("duration");
            dt = params.dt;
            dt - life_cycle >= 0 && (count++, act.set("count", count), dt -= life_cycle);
            isFinish = !(~~params.isInRect);
            times && count >= times && (isFinish = true);
            duration && (life_cycle * count + dt) >= duration && (isFinish = true);
            if (isFinish) {
              tmp.finish(actor, e, params);
              act.set("count", 0);
              actor.set({
                animaFlag: false,
                animaTime: -1
              });
            } else {
              img_id = imgIds[~~(dt / speed)];
              act.set("cache", {
                img_id: img_id
              });
              fn = show_img(actor, act, _IMG_INF, img_id);
              fn.zIndex = actor.get("zIndex");
              params.cb(fn);
              act.set("count", count);
            }
            return actor;
          }
        };
        _tmp_inners = (_ref2 = params.inners) != null ? _ref2 : params.inners = {};
        _momId = params.momId;
        _canvas = params.canvas;
        _ctx = params.ctx;
        _inners = (function(_tmp_inners, ACTOR, _momId) {
          var i, inn_i, inners;
          inners = {};
          for (i in _tmp_inners) {
            inn_i = _tmp_inners[i];
            inn_i.id = _momId;
            inn_i.canvas = _canvas;
            inn_i.ctx = _ctx;
            inners[i] = new ACTOR(inn_i);
          }
          return inners;
        })(_tmp_inners, params.ACTOR, _momId);
        this.unset("momId");
        this.unset("canvas");
        this.unset("ctx");
        this.set({
          end_time: end_time,
          evts: evts,
          duration: duration,
          life_cycle: life_cycle,
          inners: _inners
        });
        return this;
      },
      trigger_customEvts: function(params) {
        var e, evt;
        e = params.e;
        evt = this.get("evts")[e];
        evt(params.actor, this, e, params);
        return this;
      },
      get_position: function() {
        return this;
      },
      get_img: function(params) {
        return params.img_inf[params.actor_id][params.img_id];
      },
      show_img: function(params) {
        var actor, fn, img_id, _IMG_INF, _img;
        _IMG_INF = IMG_INF;
        actor = params.actor;
        img_id = params.img_id;
        _img = this.get_img({
          img_inf: _IMG_INF,
          actor_id: actor.get("id"),
          img_id: img_id
        });
        fn = function() {
          return actor.show_img({
            img: _img
          });
        };
        fn.zIndex = actor.get("zIndex");
        return fn;
      },
      idle: function(params) {
        var action, actor, cache;
        actor = params.actor;
        cache = this.get("cache");
        action = this;
        return action.show_img({
          img_id: cache.img_id,
          actor: actor
        });
      }
    });
  });

}).call(this);
