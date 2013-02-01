(function () {
    Ember.Handlebars.registerHelper('copyright', function (value, options) {
        var year = (new Date()).getFullYear();
        return new Handlebars.SafeString('<p>&copy; ' + year + ' - ' + value + '</p>');
    });
})();