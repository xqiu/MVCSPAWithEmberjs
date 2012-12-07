/// <reference path="todo.datacontext.js" />
window.todoApp.datacontext = window.createTodoAppDataContext(JSON.stringify);

window.TodoEmberApp = Em.Application.create();

TodoEmberApp.TodoList = Ember.Object.extend({
    TodoListId: 0,
    Title: "",
    UserId: "",
    //todoItems

    ErrorMessage: function (error) {
        return error;
    },

    deleteTodo: function () {
        var todoItem = this;
        return datacontext.deleteTodoItem(todoItem)
             .done(function () { self.Todos.remove(todoItem); });
    },

    addTodo: function () {
        var self = this;
        if (self.NewTodoTitle) { // need a title to save
            var todoItem = datacontext.createTodoItem(
                {
                    Title: self.NewTodoTitle,
                    TodoListId: self.TodoListId
                });
            self.Todos.push(todoItem);
            datacontext.saveNewTodoItem(todoItem);
            self.NewTodoTitle = "";
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
        return Ember.Object.extend({
            TodoItemId: data.TodoItemId,
            Title: data.Title,
            IsDone: data.IsDone,
            TodoListId: data.TodoListId,

            ErrorMessage: function (error) {
                return error;
            },
            save: function () { return datacontext.saveChangedTodoItem(self); },

            // Auto-save when these properties change
            //self.IsDone.subscribe(self.save);
            //self.Title.subscribe(self.save);
        });
    };

    function TodoList(data) {

        var self = this;
        data = data || {};

        var ret = TodoEmberApp.TodoList.create({

            TodoListId: data.TodoListId,
            UserId: data.UserId || "to be replaced",
            Title: data.Title || "My todos",
            Todos: [], //= ko.observableArray(importTodoItems(data.Todos));

            IsEditingListTitle: false,
            NewTodoTitle: null,
        });

        //// Auto-save when these properties change
        //ret.addObserver('Title', function (todoList) {
        //    return datacontext.saveChangedTodoList(todoList.toJson());
        //});

        return ret;
    };

    //// convert raw todoItem data objects into array of TodoItems
    //function importTodoItems(todoItems) {
    //    return $.map(todoItems || [],
    //            function (todoItemData) {
    //                return datacontext.createTodoItem(todoItemData);
    //            });
    //}

})(Ember, todoApp.datacontext);




//(function (ko, datacontext) {

//    datacontext.TodoItem = TodoItem;
//    datacontext.TodoList = TodoList;

//    function TodoItem(data) {
//        var self = this;
//        data = data || {};

//        // Persisted properties
//        self.TodoItemId = data.TodoItemId;
//        self.Title = ko.observable(data.Title);
//        self.IsDone = ko.observable(data.IsDone);
//        self.TodoListId = data.TodoListId;

//        // Non-persisted properties
//        self.ErrorMessage = ko.observable();

//        self.save = function () { return datacontext.saveChangedTodoItem(self); };

//        // Auto-save when these properties change
//        self.IsDone.subscribe(self.save);
//        self.Title.subscribe(self.save);
//    };

//    function TodoList(data) {
//        var self = this;
//        data = data || {};

//        // Persisted properties
//        self.TodoListId = data.TodoListId;
//        self.UserId = data.UserId || "to be replaced";
//        self.Title = ko.observable(data.Title || "My todos");
//        self.Todos = ko.observableArray(importTodoItems(data.Todos));

//        // Non-persisted properties
//        self.IsEditingListTitle = ko.observable(false);
//        self.NewTodoTitle = ko.observable();
//        self.ErrorMessage = ko.observable();

//        self.save = function () { return datacontext.saveChangedTodoList(self); };
//        self.deleteTodo = function () {
//            var todoItem = this;
//            return datacontext.deleteTodoItem(todoItem)
//                 .done(function () { self.Todos.remove(todoItem); });
//        };

//        // Auto-save when these properties change
//        self.Title.subscribe(self.save);

//    };
//    // convert raw todoItem data objects into array of TodoItems
//    function importTodoItems(todoItems) {
//        return $.map(todoItems || [],
//                function (todoItemData) {
//                    return datacontext.createTodoItem(todoItemData);
//                });
//    }
//    TodoList.prototype.addTodo = function () {
//        var self = this;
//        if (self.NewTodoTitle()) { // need a title to save
//            var todoItem = datacontext.createTodoItem(
//                {
//                    Title: self.NewTodoTitle(),
//                    TodoListId: self.TodoListId
//                });
//            self.Todos.push(todoItem);
//            datacontext.saveNewTodoItem(todoItem);
//            self.NewTodoTitle("");
//        }
//    };

//})(ko, todoApp.datacontext);
