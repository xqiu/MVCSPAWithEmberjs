/// <reference path="todo.datacontext.js" />
window.todoApp.datacontext = window.createTodoAppDataContext(JSON.stringify);

window.TodoEmberApp = Em.Application.create();

TodoEmberApp.Todo = Ember.Object.extend({
    TodoItemId: 0,
    Title: '',
    IsDone: false,
    TodoListId: 0,

    ErrorMessage: function (error) {
        return error;
    },

    saveCheckbox: function () {
        var self = this;
        return window.todoApp.datacontext.saveChangedTodoItem(self);
    }.observes('IsDone'),
    
    toJson: function () {
        var self = this;
        return JSON.stringify({
            TodoItemId: self.TodoItemId,
            Title: self.Title,
            IsDone: self.IsDone,
            TodoListId: self.TodoListId
        });
    }
});

TodoEmberApp.TodoList = Ember.Object.extend({
    TodoListId: 0,
    Title: '',
    UserId: '',
    Todos: [],
    NewTodoTitle: '',

    ErrorMessage: function (error) {
        return error;
    },

    addTodo: function (callback) {
        var self = this;
        if (self.NewTodoTitle) { // need a title to save
            var todoItem = window.todoApp.datacontext.createTodoItem(
                {
                    Title: self.NewTodoTitle,
                    TodoListId: self.TodoListId,
                    IsDone: false
                });
            window.todoApp.datacontext.saveNewTodoItem(todoItem)
                .then(addSucceeded);

            function addSucceeded() {
                if (callback) {
                    callback(todoItem);
                }
            }
            self.set('NewTodoTitle', '');
        }
    },   //do not .observes('NewTodoTitle'), as otherwise it will be called for every key change instead of focusout

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
            TodoListId: self.TodoListId,
            UserId: self.UserId,
            Title: self.Title,
            Todo: [],
            IsEditingListTitle: true,
        });
    }
});

(function (ember, datacontext) {

    datacontext.TodoItem = TodoItem;
    datacontext.TodoList = TodoList;

    function TodoItem(data) {
        var self = this;
        data = data || {};
        return TodoEmberApp.Todo.create({
            TodoItemId: data.TodoItemId,
            Title: data.Title,
            IsDone: data.IsDone,
            TodoListId: data.TodoListId,
        });
    };

    function TodoList(data) {

        var self = this;
        data = data || {};

        var ret = TodoEmberApp.TodoList.create({
            TodoListId: data.TodoListId,
            UserId: data.UserId || "to be replaced",
            Title: data.Title || "My todos",
            Todos: importTodoItems(data.Todos),

            IsEditingListTitle: false,
            NewTodoTitle: '',
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

