App.TodoListNewView = Ember.TextField.extend({
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
        
        if (todoList.get('newTodoTitle')) { // need a title to save

            var newTodo = todoList.store.createRecord("todo", {
                title: todoList.get('newTodoTitle'),
                todoListId: todoList.id,
                isDone: false
            });

            todoList.set('error', '');
            newTodo.save().then(function (data) {
                // assign the newly created id
                newTodo.set("todoItemId", data.get("id"));
            }, function (data) {
                todoList.set('error', 'Add new todo failed: ' + data.message);
            });

            todoList.get('todos').addObject(newTodo);
            todoList.set('newTodoTitle', '');
        }

    },

    insertNewline: function (evt) {
        this.focusOut();  //don't use $(evt.target).blur(); as it won't set the focus back
    }
});