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
            todoItem.set('error', '');
            todoItem.save().then(function () {
                // we break the PUT ajax call that we don't call back this resolve function.  see webapi_adapter.js ajax call for detail
            }, function (data) {
                todoItem.set('error', 'error updating:' + data.message);
            });
            this.lastValue = newValue;
        }
    }
});