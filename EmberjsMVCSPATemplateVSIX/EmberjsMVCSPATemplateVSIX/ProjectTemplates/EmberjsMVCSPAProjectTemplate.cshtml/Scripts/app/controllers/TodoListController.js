App.TodoListController = Ember.ArrayController.extend({
    error: "",
    sortProperties: ['todoListId'],
    sortAscending: false,

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    addTodoList: function () {
        var self = this;
        var todoList = window.todoApp.datacontext.createTodoList();
        todoList.isEditingListTitle = true;
        window.todoApp.datacontext.saveNewTodoList(todoList)
            .then(addSucceeded)
            .fail(addFailed);

        function addSucceeded() {
            self.set("error", "");
            self.showTodoList(todoList);
            todoList.isEditingListTitle = false;
        }
        function addFailed() {
            self.set("error", "Save of new TodoList failed");
            todoList.isEditingListTitle = false;
        }
    },
    deleteTodoList: function (todoList) {
        var self = this;
        window.todoApp.datacontext.deleteTodoList(todoList)
            .then(deleteSucceeded)
            .fail(deleteFailed);

        function deleteSucceeded() {
            self.removeObject(todoList);
        }
        function deleteFailed() {
            self.set("error", "delete todoList failed");
        }
    },
    showTodoList: function (todoList) {
        this.unshiftObject(todoList); // Insert new TodoList at the front
    },
    findTodoList: function (todoListId) {
        for (var i = 0; i < this.content.length; i++) {
            if (this.content[i].todoListId === todoListId) {
                return this.content[i];
            }
        }
        return undefined;
    },
});