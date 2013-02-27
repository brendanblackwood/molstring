require(['config/config'],
    function(config){
    require([
        'jQuery',
        'router/root',
        'Backbone',
        'jQueryUI'
    ], function($, Router, Backbone) {
        Backbone.history.start();
    });
});