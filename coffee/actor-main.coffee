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
                imgIds: ['cat/walk-1', 'cat/walk-2', 'cat/walk-3',
                         'cat/walk-4', 'cat/walk-5', 'cat/walk-6',
                         'cat/walk-7', 'cat/walk-8']
                speed: 80
                #times: 1
                evts: {
                    #init: (actor) ->
                    finish: (actor, e) ->
                        #console.log e
                        # check the correct actor to pop
                        #animaStack.pop()
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
                        statusInfo: {
                            move: {
                                speed: 150
                                imgIds: ["cat/sit-head-1","cat/sit-head-2","cat/sit-head-3","cat/sit-head-4","cat/sit-head-5",
                                   "cat/sit-head-6","cat/sit-head-7","cat/sit-head-8","cat/sit-head-9"]
                                evts: {
                                    finish: (actor, e) ->
                                        # check the correct actor to pop
                                        #animaStack.pop()
                                }
                            }
                        }
                    }
                    tail: {
                        w: 48
                        h: 51
                        x: 0
                        y: 0
                        statusInfo: {
                            move: {
                                speed: 150
                                imgIds: ["cat/sit-tail-1","cat/sit-tail-2","cat/sit-tail-3","cat/sit-tail-4","cat/sit-tail-5",
                                       "cat/sit-tail-6"]
                                evts: {
                                    finish: (actor, e) ->
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
                        head.anima({
                            actId: "move"
                            cb: (actor) ->
                                animaStack.push(actor)
                        })
                        tail = actor.find("tail")
                        tail.anima({
                            actId: "move"
                            cb: (actor) ->
                                animaStack.push(actor)
                        })
                    finish: (actor, e) ->
                        #console.log e
                        animaStack.pop()
                }
            }
        }
    })

    animaStack = []
    #cat.anima({
    #    actId: "walk"
    #    cb: (actor) ->
    #        animaStack.push(actor)
    #})
    cat.anima({
        actId: "sit"
        cb: (actor) ->
            animaStack.push(actor)
    })

    
    # clock
    window.requestAnimationFrame = (() ->
        (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            (callback, delay) ->
                #window.setTimeout(callback, 1000 / 60)
                window.setTimeout(callback, delay)
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
    nextFrame = () ->
        if timmer?
            cancelRequestAnimFrame(timmer)
        (animaStack.length && (
            timmer = requestAnimationFrame(() ->
                #console.log animaStack.length
                isIdle = true
                animaStack.forEach((actor) ->
                    (actor.chkIdle(timmer) && (
                        isIdle = false
                        false
                    ))
                )
                (!isIdle &&
                    ctx.clearRect(0, 0, canvas.width, canvas.height)
                    animaStack.forEach((actor) ->
                        actor.tick(timmer)
                    )
                    E_PAINT.scene_pool = E_PAINT.update(E_PAINT.scene_pool)
                )
                nextFrame()
            )
        ))
    nextFrame()
    self.nextFrame = nextFrame
    $("#stop").click(() ->
        cancelRequestAnimFrame(timmer)
    )
)
