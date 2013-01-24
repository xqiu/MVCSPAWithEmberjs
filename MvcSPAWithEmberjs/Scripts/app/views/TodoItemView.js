App.TodoItemView = Ember.View.extend({
    deleteTodo: function (event) {
        var todoItem = this.templateData.view.content;
        var transaction = App.store.transaction();
        todoItem.deleteRecord();
        transaction.commit();

        //todo: commit() call does not issue delete AJAX call, do not know why yet
    },
});
