App.TodoItemView = Ember.View.extend({
    deleteTodo: function (event) {
        var todoItem = this.templateData.view.content;
        var transaction = App.store.transaction();
        transaction.add(todoItem);
        
        var todoList = App.store.find(App.TodoList, todoItem.get("todoListId"));
        todoList.get('todos').removeObject(todoItem);
        
        todoItem.deleteRecord();
        transaction.commit();
    },
});
