App.TodoListView = Ember.View.extend({
    deleteTodoList: function (event) {
        var todoList = this.templateData.view.content;
        var transaction = App.store.transaction();
        todoList.deleteRecord();
        transaction.commit();

        //todo: commit() call does not issue delete AJAX call, do not know why yet
    },
});
