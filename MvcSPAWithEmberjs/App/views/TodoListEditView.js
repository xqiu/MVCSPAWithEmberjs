App.TodoListEditView = Em.TextField.extend({
    lastValue: '',
    focusIn: function (evt) {
        $(evt.target).parent("form").validate();  //initialize jquery.validate
        this.lastValue = this.get('parentView').templateData.view.content.get("title");
    },
    focusOut: function (evt) {
        this.changeContent();
    },

    insertNewline: function (evt) {
        $(evt.target).parent("form").validate();  //calling jquery.validate
        $(evt.target).blur();
    },

    changeContent: function () {
        var todoList = this.get('parentView').templateData.view.content;
        var newValue = todoList.get("title");
        if (this.lastValue != newValue) {
            todoList.set('error', '');
            todoList.save().then(function (data) {
                // we break the PUT ajax call that we don't call back this resolve function.  see webapi_adapter.js ajax call for detail
            }, function (data) {
                todoList.set('error', 'error updating:' + data.message);
            });

            this.lastValue = newValue;
        }
    }
});