/// <reference path="../ember-1.0.0-pre.2.js" />
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

            //todoList.addObserver('Title', todoList, 'saveTodoList');  //todo: every character change will call saveTodoList, how to make it only call during the blur and enter event?
        },
        deleteTodoList: function (event) {

            var todoList = this.get('content');
            this.content.removeObject(todoList);
            datacontext.deleteTodoList(todoList)
                .fail(deleteFailed);

            function deleteFailed() {
                showTodoList(todoList); // re-show the restored list
            }
        },
        findTodoList: function (todoListId) {
            for (var i = 0; i < this.content.length; i++) {
                if (this.content[i].TodoListId === todoListId) {
                    return this.content[i];
                }
            }
            return undefined;
        },
        loadTodoList: function () {
            var self = this;
            datacontext.getTodoLists(
                function (mappedTodoLists) {
                    for (var i = 0; i < mappedTodoLists.length; i++) {
                        self.pushObject(mappedTodoLists[i]);
                    }
                },
                function (error) {
                    self.error = error;
                }
            ); // load TodoLists
        }
    });

    TodoEmberApp.todosView = Em.View.extend({
        deleteTodo: function () {
            var todoItem = this.content;
            return window.todoApp.datacontext.deleteTodoItem(todoItem)
                 .done(function () {
                     var todoList = TodoEmberApp.todoListsController.findTodoList(todoItem.TodoListId);
                     todoList.Todos.removeObject(todoItem);
                 });
        },
    });

    TodoEmberApp.ErrorView = Em.View.extend({
        error: TodoEmberApp.todoListsController.error
    });

    TodoEmberApp.CreateTodoListView = Em.TextField.extend({

    });
    
    TodoEmberApp.CreateToTodoView = Ember.TextField.extend({
        focusOut: function () {
            var todoList = this.templateData.view.content;  //todo: how to properly get todoList object?
            todoList.addTodo(function (todoItem){
                todoList.Todos.pushObject(todoItem);
            });
        },

        keyUp: function (evt) {
            if (evt.keyCode === 13) {
                this.focusOut();
            }
        }
    });

    //Initialize the todoList
    TodoEmberApp.todoListsController.loadTodoList();

    //Initialize the app
    TodoEmberApp.initialize();

})(window.todoApp.datacontext);

