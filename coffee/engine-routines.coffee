define([
], () ->
    console.log "engine-routines"

    routines = {
        jump: () ->
            @
        preload: () ->
            @
        requstAnima: () ->
            @
        tick: () ->
            @
        sortActor: (actors) ->
            actors = actors.sort((a, b) ->
                a.zIndex - b.zIndex
            )
            actors
    }


    routines
)
