window.App = Em.Application.create();
App.ApplicationAdapter = DS.WebAPIAdapter.extend({
    namespace: 'api',
    antiForgeryTokenSelector: "#antiForgeryToken",
});
