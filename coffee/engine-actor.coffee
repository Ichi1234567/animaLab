define([
    "engine-action"
    "engine-paint"
], (E_ACTION, E_PAINT) ->
    console.log "engine-actor"

    ROUTINES = {
    }

    ACTOR = Backbone.Model.extend({
        initialize: (params) ->
            if !params? then return

            @valid_init(params)
            @
        valid_init: (params) ->
            _tmp_st = params.statusInfo ?= {}
            _inners = @get("inners")
            _inners = _inners ?= []
            _canvas = @get("canvas")
            _ctx = @get("ctx")
            _statusInfo = ((_tmp_st) ->
                status = {}
                for i, st_i of _tmp_st
                    st_i.ACTOR = ACTOR
                    st_i.canvas = _canvas
                    st_i.ctx = _ctx
                    st_i.momId = params.id
                    status[i] = new E_ACTION(st_i)
                status
            )(_tmp_st)
            #console.log(_inners)
            @set({
                animaFlag : false
                animaTime : -1
                zIndex    : params.zIndex    ?= 0
                visible   : params.visible   ?= true
                clickable : params.clickable ?= false
                curr_st   : params.curr_st   ?= ""
                acts      : _statusInfo
                inners    : _inners
            })
            @


        set_clikable: () ->
            @
        set_visible: () ->
            @
        set_status: (params) ->
            _status = params.actId
            if _status?
                curr_st = @get("curr_st")
                @set({
                    prev_st: curr_st
                    curr_st: _status
                })
            @
        add_status: () ->
            @
        clear: () ->
            @
        update_rect: () ->
            @
        anima: (params) ->
            # 修改current status
            @set("animaTime", 0)
            @set_status(params)
            # 修改actions的資料
            _act = @get("acts")[params.actId]
            #console.log _act.get("start_time")
            #console.log _act
            _act.set(params)
            start_time = _act.get("start_time")
            params.cb(@)
            (!start_time && @tick(0))
            @
        chkIdle: (time) ->
            actor = @
            _curr_st = actor.get("curr_st")
            _act = actor.get("acts")[_curr_st]
            _animaTime = actor.get("animaTime")
            _life_cycle = _act.get("life_cycle")
            _cycle_time = _life_cycle * _act.get("count")
            speed = _act.get("speed")
            dt = time - _animaTime - _cycle_time
            !!(dt%speed) || !_animaTime
        tick: (time) ->
            #console.log("--------------- tick ---------------")
            actor = @
            #console.log @
            _curr_st = @get("curr_st")
            _act = @get("acts")[_curr_st]
            _act_start_time = _act.get("start_time")
            _animaFlag = @get("animaFlag")
            _animaTime = @get("animaTime")
            _life_cycle = _act.get("life_cycle")
            _cycle_time = _life_cycle * _act.get("count")
            speed = _act.get("speed")
            #console.log _act
            # act at this time
            #console.log arguments
            # init
            #console.log _act.get("cache")
            (!~~_animaFlag && _animaTime >= 0 && (
                _animaTime = time + _act_start_time
                actor.set({
                    "animaFlag": true
                    "animaTime": _animaTime
                })
                _act.trigger("init", {
                    e: "init"
                    dt: 0
                    actor: actor
                    cb: (scene) ->
                        #console.log(scene)
                        E_PAINT.scene_pool.push(scene)
                })
            ))
            if (_animaFlag && time >= _animaTime)
                dt = time - _animaTime - _cycle_time
                if (!(dt%speed))
                    canvas = actor.get("canvas")
                    isInRect = E_PAINT.chkInRect({
                        cw: canvas.width
                        ch: canvas.height
                        x: actor.get("x")
                        y: actor.get("y")
                        w: actor.get("w")
                        h: actor.get("h")
                    })
                    if (dt > 0 && dt < _life_cycle && isInRect)
                        _act.trigger("during", {
                            e: "during"
                            dt: dt
                            actor: actor
                            cb: (scene) ->
                                #console.log scene
                                E_PAINT.scene_pool.push(scene)
                        })
                    # end
                    else
                        _act.trigger("finish", {
                            e: "finish"
                            dt: dt
                            actor: actor
                            isInRect: isInRect
                            cb: (scene) ->
                                E_PAINT.scene_pool.push(scene)
                        })
                else
                    E_PAINT.scene_pool.push(_act.idle({
                        actor: actor
                    }))
            @
        show_img: (params) ->
            #console.log @
            x = params.x || @get("x")
            y = params.y || @get("y")
            img = params.img
            if img?
                E_PAINT.paint({
                    x: x
                    y: y
                    w: @get("w")
                    h: @get("h")
                    ctx: @get("ctx")
                    img: img
                })
            @
        find: (elm_name) ->
            _curr_st = @get("curr_st")
            _act = @get("acts")[_curr_st]
            #console.log _act.get("inners")[elm_name]
            _act.get("inners")[elm_name]
    })
    ACTOR
)
