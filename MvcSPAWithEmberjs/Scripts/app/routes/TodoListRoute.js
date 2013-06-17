App.TodoListRoute = Ember.Route.extend({
    model: function () {
        return App.TodoList.find();
    },
});