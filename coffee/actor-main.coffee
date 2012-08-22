define([
    "engine-paint"
    "engine-actor"
    "imgs-main"
], (E_PAINT, E_ACTOR, IMGS) ->
    console.log "actor-main"
    #console.log(IMGS)
    url = "images-raw/"

    _imgs = ((IMGS) ->
        _imgs = {}
        for i, _imgi of IMGS
            result = {}
            _imgi.map((_pathi) ->
                _img = new Image()
                _img.src = url + _pathi + ".png"
                result[_pathi] = _img
            )
            _imgs[i] = result
        _imgs
    )(IMGS)
    self.IMG_INF = _imgs
    #console.log _imgs

    canvas = $("#scene").get(0)
    ctx = canvas.getContext("2d")
    cat = new E_ACTOR({
        canvas: canvas
        ctx: ctx
        id: "cat"
        w: 69
        h: 51
        x: 0
        y: 0
        imgs: _imgs.cat
        zIndex: 1
        statusInfo: {
            walk: {
                transform: {}
                imgIds: ['cat/walk-1', 'cat/walk-2', 'cat/walk-3',
                         'cat/walk-4', 'cat/walk-5', 'cat/walk-6',
                         'cat/walk-7', 'cat/walk-8']
                speed: 8
                #times: 2
                evts: {
                    finish: (actor, e) ->
                        #console.log e
                        # check the correct actor to pop
                        #animaStack.pop()
                        actor.anima({
                            #start_time: 1
                            actId: "sit"
                            times: 30
                        })
                }
            }
            sit: {
                imgIds: ["cat/sit-body"]
                inners: {
                    head: {
                        w: 48
                        h: 51
                        x: 0
                        y: 0
                        zIndex: 2
                        imgsLen: 9
                        statusInfo: {
                            move: {
                                speed: 9
                                imgIds: ["cat/sit-head-1","cat/sit-head-2","cat/sit-head-3","cat/sit-head-4","cat/sit-head-5",
                                   "cat/sit-head-6","cat/sit-head-7","cat/sit-head-8","cat/sit-head-9"]
                                evts: {
                                    #init: () ->
                                    #    console.log "head"
                                    finish: (actor, e) ->
                                        #console.log "head"
                                        # check the correct actor to pop
                                        animaStack.pop()
                                }
                            }
                        }
                    }
                    tail: {
                        w: 48
                        h: 51
                        x: 0
                        y: 0
                        imgsLen: 6
                        statusInfo: {
                            move: {
                                speed: 10
                                imgIds: ["cat/sit-tail-1","cat/sit-tail-2","cat/sit-tail-3","cat/sit-tail-4","cat/sit-tail-5",
                                       "cat/sit-tail-6"]
                                evts: {
                                    #init: () ->
                                    #    console.log "tail"
                                    finish: (actor, e) ->
                                        #console.log "tail"
                                        animaStack.pop()
                                }
                            }
                        }
                    }
                }
                #speed: 100
                evts: {
                    init: (actor, e, params) ->
                        head = actor.find("head")
                        #console.log head
                        #console.log "body"
                        head.anima({
                            actId: "move"
                            times: 5
                            cb: (actor) ->
                                animaStack.push(actor)
                        })
                        tail = actor.find("tail")
                        tail.anima({
                            actId: "move"
                            times: 5
                            cb: (actor) ->
                                animaStack.push(actor)
                        })
                    finish: (actor, e) ->
                        #console.log e
                        #animaStack.pop()
                        actor.anima({
                            #start_time: 1
                            actId: "walk"
                            times: 3
                        })
                }
            }
        }
    })

    #animaStack應該要變成globle的
    animaStack = []
    cat.anima({
        actId: "walk"
        times: 3
        cb: (actor) ->
            animaStack.push(actor)
    })
    #cat.anima({
    #    actId: "sit"
    #    cb: (actor) ->
    #        animaStack.push(actor)
    #})

    
    # clock
    #delay = 1000 / 60
    window.requestAnimationFrame = (() ->
        (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            (callback, delay) ->
                window.setTimeout(callback, 1000 / 60)
                #window.setTimeout(callback, delay)
        )
    )()

    window.cancelRequestAnimFrame = (() ->
        (
            window.cancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout
        )
    )()



    timmer = null
    Frames = 0
    UpdateTime = 1000
    LastTime = new Date()
    Fps = 0
    _Math = Math

    _MIN_TICK = 1000 / 30
    _MAX_TICK = 1000 / 60
    lastPhysics = new Date()
    physics_clock = 0
    nextFrame = () ->
        if timmer?
            cancelRequestAnimFrame(timmer)
        (animaStack.length && (
            timmer = requestAnimationFrame(() ->
                #console.log animaStack.length
                currentPysics = new Date()
                delta = currentPysics.getTime() - lastPhysics.getTime()
                if (delta > _MAX_TICK)
                    lastPhysics = currentPysics
                    isIdle = true
                    animaStack.forEach((actor) ->
                        (!actor.chkIdle(physics_clock) && (
                            isIdle = false
                            false
                        ))
                    )
                    #console.log isIdle
                    (!isIdle &&
                        #ctx.clearRect(0, 0, canvas.width, canvas.height)
                        animaStack.forEach((actor) ->
                            actor.tick(physics_clock)
                        )
                        E_PAINT.scene_pool = E_PAINT.update(E_PAINT.scene_pool, () ->
                            ctx.clearRect(0, 0, canvas.width, canvas.height)
                        )
                    )
                    E_PAINT.scene_pool = []
                    curr_time = new Date()
                    Frames++
                    dt = curr_time.getTime() - LastTime.getTime()
                    if (dt > UpdateTime)
                        _fps = _Math.round((Frames/dt) * UpdateTime)
                        Frames = 0
                        LastTime = curr_time
                        $("#fps").html(_fps)
                    physics_clock++

                nextFrame()
            )
        ))
    nextFrame()
    self.nextFrame = nextFrame
    $("#stop").click(() ->
        cancelRequestAnimFrame(timmer)
    )
)
