App.TodoItemEditView = Em.TextField.extend({
    lastValue: '',
    focusIn: function (evt) {
        this.lastValue = this.templateData.view.get("title");  //Todo: this does not get the right todoItem, why?
    },
    focusOut: function (evt) {
        this.changeContent();
    },

    insertNewline: function (evt) {
        $(evt.target).blur();
    },

    changeContent: function () {
        var todoItem = this.templateData.view;  //Todo: this does not get the right todoItem, why?
        if (this.lastValue != todoItem.get("title")) {
            // todo: direct commmit will send update for the todoList instead of todo item, what to do?
            App.store.commit();
            this.lastValue = todoItem.get("title");
        }
    }
});