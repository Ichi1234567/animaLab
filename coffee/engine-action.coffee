define([
    "vender/jq-easing"
], () ->
    console.log "engine-action"

    ACTION = Backbone.Model.extend({
        initialize: (params) ->
            @set({
                count      : 0
                times      : params.times ?= 0
                start_time : (params.start_time || 0)
                #start     : params.start ?= [0, 0]
                target     : params.target ?= [0, 0]
                speed      : params.speed ?= 1
                ease       : params.easing ?= "linear"
                cache      : { imgId: "" }
            })
            @valid_input(params)
            @on("init during finish", (params) ->
                #console.log "on"
                #console.log arguments
                _act = @
                _act.trigger_customEvts(params)
            ,@)
            @
        valid_input: (params) ->
            start_time = @get("start_time")
            end_time = (@get("end_time")) || start_time + (@get("duration") || 0)
            duration = Math.abs(start_time - end_time)
            speed = @get("speed")
            imgIds = @get("imgIds")
            imgs_num = imgIds.length
            life_cycle = imgs_num * speed


            # events def start
            tmp = params.evts ?= {}
            tmp.init ?= (actor, e) ->
                #console.log e
            tmp.during ?= (actor, e) ->
                #console.log e
            tmp.finish ?= (actor, e) ->
                #console.log e

            _IMG_INF = IMG_INF
            show_img = (actor, act, _IMG_INF, img_id) ->
                _img = act.get_img({
                    img_inf: _IMG_INF
                    actor_id: actor.get("id")
                    img_id:img_id
                })
                #console.log _img
                () ->
                    actor.show_img({
                        img: _img
                    })
            evts = {
                init: (actor, act, e, params) ->
                    #console.log(arguments)
                    # 顯示這個action的目前的image
                    #console.log(params.dt)
                    img_id = imgIds[~~(params.dt / speed)]
                    act.set("cache", {
                        img_id: img_id
                    })
                    #show_img(actor, act, _IMG_INF, img_id)
                    fn = show_img(actor, act, _IMG_INF, img_id)
                    fn.zIndex = actor.get("zIndex")
                    params.cb(fn)

                    # 使用者定義的動作
                    tmp.init(actor, e, params)
                    actor
                during: (actor, act, e, params) ->
                    #console.log(arguments)
                    # 顯示這個action的目前的image
                    dt = params.dt
                    count = act.get("count")
                    (dt - life_cycle >= 0 && (
                        count++
                        act.set("count", count)
                        dt -= life_cycle
                    ))
                    img_id = imgIds[~~(dt / speed)]
                    act.set("cache", {
                        img_id: img_id
                    })
                    #show_img(actor, act, _IMG_INF, img_id)
                    #params.cb(show_img(actor, act, _IMG_INF, img_id))
                    fn = show_img(actor, act, _IMG_INF, img_id)
                    fn.zIndex = actor.get("zIndex")
                    params.cb(fn)
                    # 使用者定義的動作
                    tmp.during(actor, e, params)
                    actor
                finish: (actor, act, e, params) ->
                    # 顯示這個action的目前的image
                    times = act.get("times")
                    count = act.get("count")
                    duration = act.get("duration")
                    dt = params.dt
                    (dt - life_cycle >= 0 && (
                        count++
                        act.set("count", count)
                        dt -= life_cycle
                    ))
                    

                    isFinish = !(~~params.isInRect)
                    (times && count >= times && (
                        isFinish = true
                    ))
                    (duration && (life_cycle * count + dt) >= duration && (
                        isFinish = true
                    ))
                    # position check

                    if (isFinish)
                        #console.log("--- finishi ---")
                        tmp.finish(actor, e, params)
                        act.set("count", 0)
                        actor.set({
                            animaFlag: false
                            animaTime: -1
                        })
                    else
                        #console.log("--- continue ---")
                        img_id = imgIds[~~(dt / speed)]
                        act.set("cache", {
                            img_id: img_id
                        })
                        #show_img(actor, act, _IMG_INF, img_id)
                        #params.cb(show_img(actor, act, _IMG_INF, img_id))
                        fn = show_img(actor, act, _IMG_INF, img_id)
                        fn.zIndex = actor.get("zIndex")
                        params.cb(fn)
                        act.set("count", count)
                    actor
            }
            # events def end

            #inner def start
            _tmp_inners = params.inners ?= {}
            _momId = params.momId
            _canvas = params.canvas
            _ctx = params.ctx
            _inners = ((_tmp_inners, ACTOR, _momId) ->
                inners = {}
                for i, inn_i of _tmp_inners
                    inn_i.id = _momId
                    inn_i.canvas = _canvas
                    inn_i.ctx = _ctx
                    inners[i] = new ACTOR(inn_i)
                inners
            )(_tmp_inners, params.ACTOR, _momId)
            #console.log (_inners)
            #inner def end
            @unset("momId")
            @unset("canvas")
            @unset("ctx")


            @set({
                end_time: end_time
                evts: evts
                duration: duration
                life_cycle: life_cycle
                inners: _inners
            })
            #console.log @
            @

        trigger_customEvts: (params) ->
            e = params.e
            #console.log(e)
            evt = @get("evts")[e]
            #console.log evt
            evt(params.actor, @, e, params)
            @
        get_position: () ->
            @
        get_img: (params) ->
            params.img_inf[params.actor_id][params.img_id]
        show_img: (params) ->
            _IMG_INF = IMG_INF
            actor = params.actor
            img_id = params.img_id
            _img = @get_img({
                img_inf: _IMG_INF
                actor_id: actor.get("id")
                img_id: img_id
            })
            #console.log _img
            fn = () ->
                actor.show_img({
                    img: _img
                })
            fn.zIndex = actor.get("zIndex")
            fn
        idle: (params) ->
            actor = params.actor
            cache = @get("cache")
            action = @
            action.show_img({
                img_id: cache.img_id
                actor: actor
            })
    })
)
