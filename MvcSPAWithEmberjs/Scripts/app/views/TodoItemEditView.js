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
            // todo: direct commmit will send update for the todoList instead of todo item, what to do?
            //App.store.commit();

            //alert(todoItem.get('isDirty'));
            var transaction = App.store.transaction();
            transaction.rollback();

            //alert(todoItem.get('isDirty'));
            todoItem = this.get('parentView').templateData.view.content;
            transaction.add(todoItem);
            todoItem.set('title', newValue);
            transaction.commit();

            this.lastValue = newValue;
        }
    }
});