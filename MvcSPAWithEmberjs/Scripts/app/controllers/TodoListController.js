App.TodoListController = Ember.ArrayController.extend({
    addTodoList: function () {
        var transaction = App.store.transaction();
        transaction.createRecord(App.TodoList, { title: "My todos", todos: [], userId: "to be replaced" });
        transaction.commit();
        //todo, what if add Failed?
        //todo, how to insert the todoList at the front of the array?
    },
});