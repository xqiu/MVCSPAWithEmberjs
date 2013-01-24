App.TodoItemView = Ember.View.extend({
    deleteTodo: function (event) {
        var todoItem = this.templateData.view.content;
        var transaction = App.store.transaction();
        //transaction.add(todoItem);
        //todoItem.deleteRecord();
        //transaction.commit();

        var todoList = App.store.find(App.TodoList, todoItem.get("todoListId"));
        transaction.add(todoList);
        //transaction.add(todoItem);
        todoList.get('todos').removeObject(todoItem);
        //todoItem.deleteRecord();
        transaction.commit();

        //todo: commit() call does not issue delete AJAX call, do not know why yet
    },
});
