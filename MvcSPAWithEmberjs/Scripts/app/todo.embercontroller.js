/// <reference path="../ember.0.9.5.min.js" />
/// <reference path="todo.datacontext.js" />
/// <reference path="todo.embermodel.js" />

(function (datacontext) {

    TodoEmberApp.todoListsController = Ember.ArrayProxy.create({
        content: [],
        error: "",
        addTodoList: function (title) {
            var self = this;
            var todoList = datacontext.createTodoList();
            todoList.IsEditingListTitle = true;
            datacontext.saveNewTodoList(todoList)
                .then(addSucceeded)
                .fail(addFailed);

            function addSucceeded() {
                self.showTodoList(todoList);
                todoList.IsEditingListTitle = false;
            }
            function addFailed() {
                error = "Save of new TodoList failed";
                todoList.IsEditingListTitle = false;
            }
        },
        showTodoList: function (todoList) {
            this.unshiftObject(todoList); // Insert new TodoList at the front

            todoList.addObserver('Title', this, 'saveTodoList');
        },
        deleteTodoList: function (todoList) {
            content.remove(todoList);
            datacontext.deleteTodoList(todoList)
                .fail(deleteFailed);

            function deleteFailed() {
                showTodoList(todoList); // re-show the restored list
            }
        },
        saveTodoList: function (todoList) {
            return datacontext.saveChangedTodoList(todoList.toJson());
        }
    });

    //datacontext.getTodoLists(TodoEmberApp.todoListsController.todoLists, TodoEmberApp.todoListsController.error); // load TodoLists
    datacontext.getTodoLists(
        function (mappedTodoLists) {
            for (var i = 0; i < mappedTodoLists.length; i++) {
                TodoEmberApp.todoListsController.pushObject(mappedTodoLists[i]);

                mappedTodoLists[i].addObserver('Title', mappedTodoLists[i], 'saveTodoList');
            }
        },
        function (error) {
            TodoEmberApp.todoListsController.error = error;
        }
    ); // load TodoLists


    TodoEmberApp.ErrorView = Em.View.extend({
        error: TodoEmberApp.todoListsController.error
    });

    TodoEmberApp.CreateTodoView = Em.TextField.extend({
        //insertNewline: function () {
        //    var value = this.get('value');
        //    if (value) {
        //        TodoEmberApp.todoListsController.addTodoList(value);
        //    }
        //}

    });

    TodoEmberApp.TodoListView = Ember.View.extend({
        classNameBindings: ['todoList']

        //click: function () {
        //    var content = this.get('content');

        //    App.selectedContactController.set('content', content);
        //},

        //touchEnd: function () {
        //    this.click();
        //},

        //isSelected: function () {
        //    var selectedItem = App.selectedContactController.get('content'),
        //        content = this.get('content');

        //    if (content === selectedItem) { return true; }
        //}.property('App.selectedContactController.content')
    });

    TodoEmberApp.TextField = Ember.TextField.extend({
        didInsertElement: function () {
            this.$().focus();
        }
    });

    TodoEmberApp.EditField = Ember.View.extend({
        tagName: 'span',
        templateName: 'edit-field',

        doubleClick: function () {
            this.set('isEditing', true);
            return false;
        },

        touchEnd: function () {
            // Rudimentary double tap support, could be improved
            var touchTime = new Date();
            if (this._lastTouchTime && touchTime - this._lastTouchTime < 250) {
                this.doubleClick();
                this._lastTouchTime = null;
            } else {
                this._lastTouchTime = touchTime;
            }

            // Prevent zooming
            return false;
        },

        focusOut: function () {
            this.set('isEditing', false);
        },

        keyUp: function (evt) {
            if (evt.keyCode === 13) {
                this.set('isEditing', false);
            }
        }
    });

    Ember.Handlebars.registerHelper('editable', function (path, options) {
        options.hash.valueBinding = path;
        return Ember.Handlebars.helpers.view.call(this, TodoEmberApp.EditField, options);
    });

})(window.todoApp.datacontext);

//todoApp.datacontext = window.todoApp.datacontext(ko.toJson);
//window.todoApp.todoListViewModel = (function (ko, datacontext) {
//    var todoLists = ko.observableArray(),
//        error = ko.observable(),
//        addTodoList = function () {
//            var todoList = datacontext.createTodoList();
//            todoList.IsEditingListTitle(true);
//            datacontext.saveNewTodoList(todoList)
//                .then(addSucceeded)
//                .fail(addFailed);

//            function addSucceeded() {
//                showTodoList(todoList);
//            }
//            function addFailed() {
//                error("Save of new TodoList failed");
//            }
//        },
//        showTodoList = function (todoList) {
//            todoLists.unshift(todoList); // Insert new TodoList at the front
//        },
//        deleteTodoList = function (todoList) {
//            todoLists.remove(todoList);
//            datacontext.deleteTodoList(todoList)
//                .fail(deleteFailed);

//            function deleteFailed() {
//                showTodoList(todoList); // re-show the restored list
//            }
//        };

//    datacontext.getTodoLists(todoLists, error); // load TodoLists

//    return {
//        todoLists: todoLists,
//        error: error,
//        addTodoList: addTodoList,
//        deleteTodoList: deleteTodoList
//    };

//})(ko, todoApp.datacontext);

//// Initiate the Knockout bindings
//ko.applyBindings(window.todoApp.todoListViewModel);
