App.TodoListsController = Ember.ArrayController.extend({
    error: "",
    sortProperties: ['todoListId'],
    sortAscending: false,

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    addTodoList: function () {
        var todoList = this.store.createRecord("todoList", { title: "My todos", todos: [], userId: "to be replaced" });

        todoList.save().then(function (data) {
            // Need to re-assign Id, a work we might be able to fix in the future when ember-data stablized
            todoList.set("todoListId", data.get("todoListId"));
            todoList.set('error', '');
        }, function (data) {
            todoList.set("error", "Error: " + data.message);
        });
    },

    actions: {

        deleteTodoList: function (todoListId) {
            var self = this;
            this.store.find("todoList", todoListId).then(function (todoList) {
                todoList.deleteRecord();
                todoList.save().then(function () {
                    todoList.set('error', '');
                }, function (data) {
                    todoList.set('error', "Delete Error: " + data.message);
                });
            });
        },

        deleteTodo: function (todoItemId) {
            var self = this;
            this.store.find("todo", todoItemId).then(function (todoItem) {
                self.store.find("todoList", todoItem.get("todoListId")).then(function (todoList) {
                    todoItem.deleteRecord();
                    todoItem.save().then(function () {
                        todoList.set('error', '');
                        todoList.get('todos').removeObject(todoItem);

                        delete todoItem;
                    }, function (data) {
                        todoList.set('error', "Delete Error: " + data.message);
                    });

                });
            });
        },
    }

});