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
        todoList.addTodo(function (todoItem) {
        });
    },

    insertNewline: function (evt) {
        this.focusOut();  //don't use $(evt.target).blur(); as it won't set the focus back
    }
});