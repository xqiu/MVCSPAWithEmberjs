App.TodoListController = Ember.ArrayController.extend({
    error: "",
    sortProperties: ['todoListId'],
    sortAscending: false,

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    addTodoList: function () {
        var transaction = App.store.transaction();
        var todoList = transaction.createRecord(App.TodoList, { title: "My todos", todos: [], userId: "to be replaced" });
        transaction.commit();

        //todo: error handling once ember-data provide better error handling mechnism
    },
});