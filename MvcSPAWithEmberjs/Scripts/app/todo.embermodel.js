/// <reference path="todo.datacontext.js" />
window.TodoEmberApp = Em.Application.create({
    rootElement: '#main-content',
    ready: function () {
        //Initialize the todoList
        this.todoListsController.loadTodoList();
    }
});

TodoEmberApp.Todo = Ember.Object.extend({
    todoItemId: 0,
    title: '',
    isDone: false,
    todoListId: 0,
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    saveCheckbox: function () {
        var self = this;
        return window.todoApp.datacontext.saveChangedTodoItem(self);
    }.observes('isDone'),
    
    toJson: function () {
        var self = this;
        return JSON.stringify({
            todoItemId: self.todoItemId,
            title: self.title,
            isDone: self.isDone,
            todoListId: self.todoListId
        });
    }
});

TodoEmberApp.TodoList = Ember.Object.extend({
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

    deleteTodoList: function (event) {
        //todo: this function should belong to todo.embercontroller.js, but I don't know how to make the contentBinding and target combination work properly
        TodoEmberApp.todoListsController.content.removeObject(this);
        window.todoApp.datacontext.deleteTodoList(this)
            .fail(deleteFailed);

        function deleteFailed() {
            showTodoList(this); // todo: re-show the restored list, this function is not defined in this context
        }
    },

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

// datacontext call back functions, so that different framework (e.g. knockoutjs and emberjs) can use the same datacontext.js file
(function (ember, datacontext) {

    datacontext.todoItem = todoItem;
    datacontext.todoList = todoList;

    function todoItem(data) {
        var self = this;
        data = data || {};
        return TodoEmberApp.Todo.create({
            todoItemId: data.todoItemId,
            title: data.title,
            isDone: data.isDone,
            todoListId: data.todoListId,
        });
    };

    function todoList(data) {

        var self = this;
        data = data || {};

        var ret = TodoEmberApp.TodoList.create({
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
                    return datacontext.createTodoItem(todoItemData);
                });
    }

})(Ember, todoApp.datacontext);

