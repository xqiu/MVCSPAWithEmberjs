App.TodoItemView = Ember.View.extend({
    deleteTodo: function (event) {
        var todoItem = this.templateData.view.content;
        var transaction = App.store.transaction();

        if (todoItem.get('isDirty')) {
            todoItem.set('isDirty', false)
        }
        
        transaction.add(todoItem);
        
        var todoList = App.store.find(App.TodoList, todoItem.get("todoListId"));
        todoList.get('todos').removeObject(todoItem);
        
        todoItem.deleteRecord();
        transaction.commit();

        delete todoItem;
    },
});
