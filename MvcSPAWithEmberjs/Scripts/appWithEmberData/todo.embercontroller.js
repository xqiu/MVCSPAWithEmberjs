/// <reference path="../ember-1.0.0-pre.2.js" />
/// <reference path="todo.embermodel.js" />

(function () {
    
    TodoEmberApp.Router.map(function () {
        //match('/').to('index');  master 01072013 syntax
        this.route("index", { path: "/" });  //master 01142013 syntax
    });

    TodoEmberApp.IndexRoute = Ember.Route.extend({
        renderTemplate: function () {
            this.render('todoTemplate');

            //this.render('todoDetail', {   // the template to render
            //    into: 'todoTemplate',          // the template to render into
            //    //outlet: 'detail',       // the name of the outlet in that template
            //    //controller: 'todoListsController'  // the controller to use for the template
            //});
        }
    });

    TodoEmberApp.todoListsController = Ember.ArrayProxy.create({
        content: TodoEmberApp.TodoList.find(),
        error: "",
        addTodoList: function () {
            var transaction = TodoEmberApp.store.transaction();
            transaction.createRecord(TodoEmberApp.TodoList, { title: "My todos", todos: [], userId: "to be replaced" });
            transaction.commit();
        },
        showTodoList: function (todoList) {
            this.unshiftObject(todoList); // Insert new TodoList at the front
        },
        deleteTodoList: function (event) {
            alert("todo, find a proper place for the delete event");
            var transaction = TodoEmberApp.store.transaction();
            transaction.add(TodoEmberApp.TodoList.find(4));
            TodoEmberApp.TodoList.find(4).deleteRecord();
            transaction.commit();
        },
    });

    TodoEmberApp.todosView = Em.View.extend({
        deleteTodo: function () {
            var todoItem = this.content;

            var transaction = TodoEmberApp.store.transaction();
            transaction.add(todoItem);
            todoItem.deleteRecord();
            transaction.commit();
        },
    });

    TodoEmberApp.ErrorView = Em.View.extend({
        error: TodoEmberApp.todoListsController.error
    });

    TodoEmberApp.EditTodoListView = Em.TextField.extend({
        lastValue: '',
        ////todo: see if we can use validate inside init function instead of calling focusIn and keyUp
        //init: function () {
        //    this._super();
        //    $(this).parent("form").validate();  //initialize jquery.validate
        //},
        focusIn: function (evt) {
            $(evt.target).parent("form").validate();  //initialize jquery.validate
            this.lastValue = this.templateData.view.content.get("title");
        },
        focusOut: function (evt) {
            this.changeContent();
        },
        
        insertNewline: function (evt) {
            $(evt.target).parent("form").validate();  //calling jquery.validate
            $(evt.target).blur();
        },
        
        changeContent: function () {
            var todoList = this.templateData.view.content;
            if (this.lastValue != todoList.get("title")) {
                TodoEmberApp.store.commit();
                this.lastValue = todoList.get("title");
            }
        }
    });

    TodoEmberApp.EditTodoItemView = Em.TextField.extend({
        lastValue: '',
        focusIn: function (evt) {
            this.lastValue = this.templateData.view.content.title;
        },
        focusOut: function (evt) {
            this.changeContent();
        },

        insertNewline: function (evt) {
            $(evt.target).blur();
        },

        changeContent: function () {
            var todoItem = this.templateData.view.content;
            if (this.lastValue != todoItem.get("title")) {

                // todo: direct commmit will send update for the todoList instead of todo item, what to do?

                TodoEmberApp.store.commit();
                this.lastValue = todoItem.get("title");
            }
        }
    });

    TodoEmberApp.CreateTodoView = Ember.TextField.extend({
        //todo: overwrite placeholder for legacy browsers including IE9
        //placeholder: function () {
        //    var placeholderText = ko.utils.unwrapObservable(valueAccessor()),
        //        input = $(elem);

        //    input.attr('placeholder', placeholderText);

        //    // For older browsers, manually implement placeholder behaviors
        //    if (!Modernizr.input.placeholder) {
        //        input.focus(function () {
        //            if (input.val() === placeholderText) {
        //                input.val('');
        //                input.removeClass('placeholder');
        //            }
        //        }).blur(function () {
        //            setTimeout(function () {
        //                if (input.val() === '' || input.val() === placeholderText) {
        //                    input.addClass('placeholder');
        //                    input.val(placeholderText);
        //                }
        //            }, 0);
        //        }).blur();

        //        input.parents('form').submit(function () {
        //            if (input.val() === placeholderText) {
        //                input.val('');
        //            }
        //        });
        //    }
        //},
        focusOut: function () {
            var todoList = this.templateData.view.content;
            todoList.addTodo(function (todoItem) {
                //todoList.get("todos").content.pushObject(todoItem);
            });
        },

        insertNewline: function (evt) {
            this.focusOut();  //don't use $(evt.target).blur(); as it won't set the focus back
        }
    });


})();

