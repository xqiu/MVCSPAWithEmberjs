App.TodoListView = Ember.View.extend({
    deleteTodoList: function (event) {
        var todoList = this.templateData.view.content;
        var transaction = App.store.transaction();
        transaction.add(todoList);
        todoList.deleteRecord();

        transaction.commit();
    },
});
