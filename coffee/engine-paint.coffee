define([
], () ->
    console.log "engine-paint"
    {
        update: (params) ->
            #console.log(params)
            x = params.x
            y = params.y
            w = params.w
            h = params.h
            img = params.img
            ctx = params.ctx
            ctx.drawImage(img, 0, 0)
            @
        clear: (params) ->
            canvas = params.canvas
            ctx = params.ctx
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            @
        chkInRect: (params) ->
            cw = params.cw
            ch = params.ch
            x = params.x
            y = params.y
            w = params.w
            h = params.h
            ((x * (x - cw) <= 0 && (y * (y - ch) <= 0)) ||
             ((x + w) * (x + w - cw) <= 0 && (y + h) * (y + h - ch) <= 0))
    }
)
