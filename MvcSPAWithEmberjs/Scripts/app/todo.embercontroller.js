/// <reference path="../ember-1.0.0-pre.2.js" />
/// <reference path="todo.datacontext.js" />
/// <reference path="todo.embermodel.js" />

(function (datacontext) {
    
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
        content: [],
        error: "",
        addTodoList: function () {
            var self = this;
            var todoList = datacontext.createTodoList();
            todoList.isEditingListTitle = true;
            datacontext.saveNewTodoList(todoList)
                .then(addSucceeded)
                .fail(addFailed);

            function addSucceeded() {
                self.showTodoList(todoList);
                todoList.isEditingListTitle = false;
            }
            function addFailed() {
                error = "Save of new TodoList failed";
                todoList.isEditingListTitle = false;
            }
        },
        showTodoList: function (todoList) {
            this.unshiftObject(todoList); // Insert new TodoList at the front
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
                if (this.content[i].todoListId === todoListId) {
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
            );
        }
    });

    TodoEmberApp.todosView = Em.View.extend({
        deleteTodo: function () {
            var todoItem = this.content;
            return window.todoApp.datacontext.deleteTodoItem(todoItem)
                 .done(function () {
                     var todoList = TodoEmberApp.todoListsController.findTodoList(todoItem.todoListId);
                     todoList.todos.removeObject(todoItem);
                 });
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
            this.lastValue = this.templateData.view.content.title;
        },
        focusOut: function (evt) {
            this.changeContent();
        },
        
        insertNewline: function (evt) {
            $(evt.target).parent("form").validate();  //calling jquery.validate
            $(evt.target).blur();
        },
        
        changeContent: function () {
            var todoList = this.templateData.view.content;  //todo: how to properly get todoList object?
            if (this.lastValue != todoList.title) {
                window.todoApp.datacontext.saveChangedTodoList(todoList);
                this.lastValue = todoList.title;
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
            var todoItem = this.templateData.view.content;  //todo: how to properly get todoList object?
            if (this.lastValue != todoItem.title) {
                window.todoApp.datacontext.saveChangedTodoItem(todoItem);
                this.lastValue = todoItem.title;
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
            var todoList = this.templateData.view.content;  //todo: how to properly get todoList object?
            todoList.addTodo(function (todoItem) {
                todoList.todos.pushObject(todoItem);
            });
        },

        insertNewline: function (evt) {
            this.focusOut();  //don't use $(evt.target).blur(); as it won't set the focus back
        }
    });


})(window.todoApp.datacontext);

