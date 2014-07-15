App.TodoListsRoute = Ember.Route.extend({
    model: function () {
        return this.store.find('todoList');
    },
});

App.TodoListRoute = Ember.Route.extend({
    model: function (params) {
        return this.store.find('todoList', params.todoList_id);
    },
});