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

            todoList.save().then(function () {
                // work with saved data
                // newly created records are guaranteed to have IDs assigned
            }, function (data) {
                // work with data that failed to save
                todoList.set('error', 'error updating:' + data.message);
            });

            this.lastValue = newValue;
        }
    }
});