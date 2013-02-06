App.TodoListRoute = Ember.Route.extend({
    setupController: function (controller, model) {
        var self = this;
        window.todoApp.datacontext.getTodoLists(
            function (mappedTodoLists) {
                controller.set('content', mappedTodoLists);
            },
            function (error) {
                self.error = error;
            }
        );
    }
});