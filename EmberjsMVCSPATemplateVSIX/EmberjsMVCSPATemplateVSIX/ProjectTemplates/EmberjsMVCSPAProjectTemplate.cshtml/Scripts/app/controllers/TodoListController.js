App.TodoListController = Ember.ArrayController.extend({
    sortProperties: ['todoListId'],
    sortAscending: false,
    addTodoList: function () {
        var transaction = App.store.transaction();
        var todoList = transaction.createRecord(App.TodoList, { title: "My todos", todos: [], userId: "to be replaced" });
        transaction.commit();
    },
});