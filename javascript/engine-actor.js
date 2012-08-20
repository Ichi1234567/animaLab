(function() {

  define(["engine-action", "engine-paint"], function(E_ACTION, E_PAINT) {
    var ACTOR, ROUTINES;
    console.log("engine-actor");
    ROUTINES = {};
    ACTOR = Backbone.Model.extend({
      initialize: function(params) {
        if (!(params != null)) return;
        this.valid_init(params);
        return this;
      },
      valid_init: function(params) {
        var _canvas, _ctx, _inners, _ref, _ref2, _ref3, _ref4, _ref5, _statusInfo, _tmp_st;
        _tmp_st = (_ref = params.statusInfo) != null ? _ref : params.statusInfo = {};
        _inners = this.get("inners");
        _inners = _inners != null ? _inners : _inners = [];
        _canvas = this.get("canvas");
        _ctx = this.get("ctx");
        _statusInfo = (function(_tmp_st) {
          var i, st_i, status;
          status = {};
          for (i in _tmp_st) {
            st_i = _tmp_st[i];
            st_i.ACTOR = ACTOR;
            st_i.canvas = _canvas;
            st_i.ctx = _ctx;
            st_i.momId = params.id;
            status[i] = new E_ACTION(st_i);
          }
          return status;
        })(_tmp_st);
        this.set({
          animaFlag: false,
          animaTime: -1,
          zIndex: (_ref2 = params.zIndex) != null ? _ref2 : params.zIndex = 0,
          visible: (_ref3 = params.visible) != null ? _ref3 : params.visible = true,
          clickable: (_ref4 = params.clickable) != null ? _ref4 : params.clickable = false,
          curr_st: (_ref5 = params.curr_st) != null ? _ref5 : params.curr_st = "",
          acts: _statusInfo,
          inners: _inners
        });
        return this;
      },
      set_clikable: function() {
        return this;
      },
      set_visible: function() {
        return this;
      },
      set_status: function(params) {
        var curr_st, _status;
        _status = params.actId;
        if (_status != null) {
          curr_st = this.get("curr_st");
          this.set({
            prev_st: curr_st,
            curr_st: _status
          });
        }
        return this;
      },
      add_status: function() {
        return this;
      },
      clear: function() {
        return this;
      },
      update_rect: function() {
        return this;
      },
      anima: function(params) {
        var start_time, _act;
        this.set("animaTime", 0);
        this.set_status(params);
        _act = this.get("acts")[params.actId];
        _act.set(params);
        start_time = _act.get("start_time");
        params.cb(this);
        !start_time && this.tick(0);
        return this;
      },
      chkIdle: function(time) {
        var actor, dt, speed, _act, _animaTime, _curr_st, _cycle_time, _life_cycle;
        actor = this;
        _curr_st = actor.get("curr_st");
        _act = actor.get("acts")[_curr_st];
        _animaTime = actor.get("animaTime");
        _life_cycle = _act.get("life_cycle");
        _cycle_time = _life_cycle * _act.get("count");
        speed = _act.get("speed");
        dt = time - _animaTime - _cycle_time;
        return !!(dt % speed) || !_animaTime;
      },
      tick: function(time) {
        var actor, canvas, dt, isInRect, speed, _act, _act_start_time, _animaFlag, _animaTime, _curr_st, _cycle_time, _life_cycle;
        actor = this;
        _curr_st = this.get("curr_st");
        _act = this.get("acts")[_curr_st];
        _act_start_time = _act.get("start_time");
        _animaFlag = this.get("animaFlag");
        _animaTime = this.get("animaTime");
        _life_cycle = _act.get("life_cycle");
        _cycle_time = _life_cycle * _act.get("count");
        speed = _act.get("speed");
        !~~_animaFlag && _animaTime >= 0 && (_animaTime = time + _act_start_time, actor.set({
          "animaFlag": true,
          "animaTime": _animaTime
        }), _act.trigger("init", {
          e: "init",
          dt: 0,
          actor: actor,
          cb: function(scene) {
            return E_PAINT.scene_pool.push(scene);
          }
        }));
        if (_animaFlag && time >= _animaTime) {
          dt = time - _animaTime - _cycle_time;
          if (!(dt % speed)) {
            canvas = actor.get("canvas");
            isInRect = E_PAINT.chkInRect({
              cw: canvas.width,
              ch: canvas.height,
              x: actor.get("x"),
              y: actor.get("y"),
              w: actor.get("w"),
              h: actor.get("h")
            });
            if (dt > 0 && dt < _life_cycle && isInRect) {
              _act.trigger("during", {
                e: "during",
                dt: dt,
                actor: actor,
                cb: function(scene) {
                  return E_PAINT.scene_pool.push(scene);
                }
              });
            } else {
              _act.trigger("finish", {
                e: "finish",
                dt: dt,
                actor: actor,
                isInRect: isInRect,
                cb: function(scene) {
                  return E_PAINT.scene_pool.push(scene);
                }
              });
            }
          } else {
            E_PAINT.scene_pool.push(_act.idle({
              actor: actor
            }));
          }
        }
        return this;
      },
      show_img: function(params) {
        var img, x, y;
        x = params.x || this.get("x");
        y = params.y || this.get("y");
        img = params.img;
        if (img != null) {
          E_PAINT.paint({
            x: x,
            y: y,
            w: this.get("w"),
            h: this.get("h"),
            ctx: this.get("ctx"),
            img: img
          });
        }
        return this;
      },
      find: function(elm_name) {
        var _act, _curr_st;
        _curr_st = this.get("curr_st");
        _act = this.get("acts")[_curr_st];
        return _act.get("inners")[elm_name];
      }
    });
    return ACTOR;
  });

}).call(this);
