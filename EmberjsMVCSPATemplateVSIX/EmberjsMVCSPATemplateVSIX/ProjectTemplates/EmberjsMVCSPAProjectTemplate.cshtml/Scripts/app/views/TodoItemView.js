App.TodoItemView = Ember.View.extend({
    deleteTodo: function (event) {
        var todoItem = this.templateData.view.content;
        var self = this;
        return window.todoApp.datacontext.deleteTodoItem(todoItem)
             .done(function () {
                 var todoList = self.get('controller').findTodoList(todoItem.todoListId);
                 todoList.todos.removeObject(todoItem);
             });

    },
});
