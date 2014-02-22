App.TodoListsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todoList');
    },
});

App.TodoListRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todoList');
    },
});