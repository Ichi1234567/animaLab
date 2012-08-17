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
        var _ref, _ref2, _ref3, _ref4, _ref5, _ref6, _statusInfo, _tmp_st;
        _tmp_st = (_ref = params.statusInfo) != null ? _ref : params.statusInfo = {};
        _statusInfo = (function(_tmp_st) {
          var i, st_i, status;
          status = {};
          for (i in _tmp_st) {
            st_i = _tmp_st[i];
            status[i] = new E_ACTION(st_i);
          }
          return status;
        })(_tmp_st);
        return this.set({
          animaFlag: false,
          animaTime: -1,
          zIndex: (_ref2 = params.zIndex) != null ? _ref2 : params.zIndex = 0,
          visible: (_ref3 = params.visible) != null ? _ref3 : params.visible = true,
          clickable: (_ref4 = params.clickable) != null ? _ref4 : params.clickable = false,
          curr_st: (_ref5 = params.curr_st) != null ? _ref5 : params.curr_st = "",
          inners: (_ref6 = params.inners) != null ? _ref6 : params.inners = {},
          acts: _statusInfo
        });
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
        var _act;
        this.set("animaTime", 0);
        this.set_status(params);
        _act = this.get("acts")[params.actId];
        _act.set(params);
        params.cb(this);
        return this;
      },
      tick: function(time) {
        var actor, canvas, dt, isInRect, _act, _act_start_time, _animaFlag, _animaTime, _curr_st, _cycle_time, _life_cycle;
        actor = this;
        _curr_st = this.get("curr_st");
        _act = this.get("acts")[_curr_st];
        _act_start_time = _act.get("start_time");
        _animaFlag = this.get("animaFlag");
        _animaTime = this.get("animaTime");
        _life_cycle = _act.get("life_cycle");
        _cycle_time = _life_cycle * _act.get("count");
        !~~_animaFlag && _animaTime >= 0 && (_animaTime = time + _act_start_time, actor.set({
          "animaFlag": true,
          "animaTime": _animaTime
        }), _act.trigger("init", {
          e: "init",
          dt: 0,
          actor: actor
        }));
        if (_animaFlag && time >= _animaTime) {
          canvas = actor.get("canvas");
          isInRect = E_PAINT.chkInRect({
            cw: canvas.width,
            ch: canvas.height,
            x: actor.get("x"),
            y: actor.get("y"),
            w: actor.get("w"),
            h: actor.get("h")
          });
          dt = time - _animaTime - _cycle_time;
          if (dt > 0 && dt < _life_cycle && isInRect) {
            _act.trigger("during", {
              e: "during",
              dt: dt,
              actor: actor
            });
          } else {
            _act.trigger("finish", {
              e: "finish",
              dt: dt,
              actor: actor,
              isInRect: isInRect
            });
          }
        }
        return this;
      },
      show_img: function(params) {
        var img, x, y;
        x = params.x || this.get("x");
        y = params.y || this.get("y");
        img = params.img;
        E_PAINT.update({
          x: x,
          y: y,
          w: this.get("w"),
          h: this.get("h"),
          ctx: this.get("ctx"),
          img: img
        });
        return this;
      }
    });
    return ACTOR;
  });

}).call(this);
