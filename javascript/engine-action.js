(function() {

  define(["vender/jq-easing"], function() {
    var ACTION;
    console.log("engine-action");
    return ACTION = Backbone.Model.extend({
      initialize: function(params) {
        var action, _ref, _ref2, _ref3, _ref4;
        action = this;
        action.set({
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
        action.valid_input(params);
        action.on("init during finish", function(params) {
          var _act;
          _act = action;
          return _act.trigger_customEvts(params);
        }, action);
        return this;
      },
      valid_input: function(params) {
        var action, duration, end_time, evts, imgIds, imgs_num, life_cycle, speed, start_time, tmp, _canvas, _ctx, _inners, _momId, _ref, _ref2, _start_time, _tmp_inners;
        action = this;
        start_time = action.get("start_time");
        end_time = (action.get("end_time")) || start_time + (action.get("duration") || 0);
        duration = Math.abs(start_time - end_time);
        speed = action.get("speed");
        imgIds = action.get("imgIds");
        imgs_num = imgIds.length;
        life_cycle = imgs_num * speed;
        tmp = (_ref = params.evts) != null ? _ref : params.evts = {};
        if (tmp.init == null) tmp.init = function(actor, e) {};
        if (tmp.during == null) tmp.during = function(actor, e) {};
        if (tmp.finish == null) tmp.finish = function(actor, e) {};
        evts = {
          init: function(actor, act, e, params) {
            var fn, img_id;
            img_id = imgIds[~~(params.dt / speed)];
            act.set("cache", {
              img_id: img_id
            });
            fn = act.show_img({
              img_id: img_id,
              actor: actor
            });
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
            fn = act.show_img({
              img_id: img_id,
              actor: actor
            });
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
                animaFlag: false
              });
            } else {
              img_id = imgIds[~~(dt / speed)];
              act.set("cache", {
                img_id: img_id
              });
              fn = act.show_img({
                img_id: img_id,
                actor: actor
              });
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
        _start_time = action.get("start_time");
        _inners = (function(_tmp_inners, ACTOR, _momId, _start_time) {
          var i, inn_i, inners;
          inners = {};
          for (i in _tmp_inners) {
            inn_i = _tmp_inners[i];
            inn_i.id = _momId;
            inn_i.canvas = _canvas;
            inn_i.ctx = _ctx;
            inn_i.start_time = _start_time;
            inners[i] = new ACTOR(inn_i);
          }
          return inners;
        })(_tmp_inners, params.ACTOR, _momId, _start_time);
        action.unset("momId");
        action.unset("canvas");
        action.unset("ctx");
        action.set({
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
        var actor, fn, img_id, mother, x, y, _IMG_INF, _img;
        _IMG_INF = IMG_INF;
        actor = params.actor;
        img_id = params.img_id;
        _img = this.get_img({
          img_inf: _IMG_INF,
          actor_id: actor.get("id"),
          img_id: img_id
        });
        !!actor.get("mother") && (mother = actor.get("mother"), x = mother.get("x"), y = mother.get("y"));
        x = x != null ? x : x = 0;
        y = y != null ? y : y = 0;
        fn = function() {
          return actor.show_img({
            img: _img,
            x: x + actor.get("x"),
            y: y + actor.get("y")
          });
        };
        fn.zIndex = actor.get("zIndex");
        return fn;
      },
      idle: function(params) {
        var action, actor, cache;
        actor = params.actor;
        action = this;
        cache = action.get("cache");
        return action.show_img({
          img_id: cache.img_id,
          actor: actor
        });
      },
      updateInners: function(params) {
        var i, inn_i, inners, _results;
        inners = this.get("inners");
        _results = [];
        for (i in inners) {
          inn_i = inners[i];
          _results.push(inn_i.set("animaTime", params.animaTime));
        }
        return _results;
      }
    });
  });

}).call(this);
