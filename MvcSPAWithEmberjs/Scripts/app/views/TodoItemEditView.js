App.TodoItemEditView = Em.TextField.extend({
    lastValue: '',
    focusIn: function (evt) {
        this.lastValue = this.get('parentView').templateData.view.content.get("title");
    },
    focusOut: function (evt) {
        this.changeContent();
    },

    insertNewline: function (evt) {
        $(evt.target).blur();
    },

    changeContent: function () {
        var todoItem = this.get('parentView').templateData.view.content;
        var newValue = todoItem.get("title");
        if (this.lastValue != newValue) {

            todoItem.save().then(function () {
                // Some how needed, otherwise the following delete going to fail as this todoItemId is null
                todoItem.set("todoItemId", todoItem.get("id"));
            }, function () {
                // work with data that failed to save
                todoItem.set('error', 'error updating:' + data.message);
            });
            this.lastValue = newValue;
        }
    }
});