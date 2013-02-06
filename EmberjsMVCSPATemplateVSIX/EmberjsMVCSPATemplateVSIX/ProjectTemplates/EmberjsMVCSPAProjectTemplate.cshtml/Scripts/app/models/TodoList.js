App.TodoList = Ember.Object.extend({
    todoListId: 0,
    title: '',
    userId: '',
    todos: [],
    newTodoTitle: '',
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    addTodo: function (callback) {
        var self = this;
        if (self.newTodoTitle) { // need a title to save
            var todoItem = window.todoApp.datacontext.createTodoItem(
                {
                    title: self.newTodoTitle,
                    todoListId: self.todoListId,
                    isDone: false
                });
            window.todoApp.datacontext.saveNewTodoItem(todoItem)
                .then(addSucceeded);

            function addSucceeded() {
                if (callback) {
                    callback(todoItem);
                }
            }
            self.set('newTodoTitle', '');
        }
    },   //do not .observes('newTodoTitle'), as otherwise it will be called for every key change instead of focusout
    
    toJson: function () {
        var self = this;
        return JSON.stringify({
            todoListId: self.todoListId,
            userId: self.userId,
            title: self.title,
            todo: [],
            isEditingListTitle: true,
        });
    }
});

(function (ember, datacontext) {

    datacontext.todoList = todoList;

    function todoList(data) {

        var self = this;
        data = data || {};

        var ret = App.TodoList.create({
            todoListId: data.todoListId,
            userId: data.userId || "to be replaced",
            title: data.title || "My todos",
            todos: importTodoItems(data.todos),

            isEditingListTitle: false,
            newTodoTitle: '',
        });

        return ret;
    };

    // convert raw todoItem data objects into array of TodoItems
    function importTodoItems(todoItems) {
        return $.map(todoItems || [],
                function (todoItemData) {
                    return window.todoApp.datacontext.createTodoItem(todoItemData);
                });
    }

})(Ember, todoApp.datacontext);

