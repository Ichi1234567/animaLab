define([
    "engine-actor"
    "imgs-main"
], (E_ACTOR, IMGS) ->
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
                        animaStack.pop()
                }
            }
        }
    })
    #cat.show_img({
    #    img: _imgs.cat['cat/walk-1']
    #})

    animaStack = []
    cat.anima({
        actId: "walk"
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
            #function FrameRequestCallback, DOMElement Element 
            (callback, element) ->
                window.setTimeout( callback, 1000 / 60 )
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
