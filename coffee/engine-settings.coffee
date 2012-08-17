require([
    "engine-main"
], (E_MODEL) ->
    console.log "engine-settings"
    console.log E_MODEL
    Backbone.View.extend({
        initialize: () ->
            @
        events: {
        }
    })
)
