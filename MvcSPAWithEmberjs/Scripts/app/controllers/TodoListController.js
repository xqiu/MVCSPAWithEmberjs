App.TodoListController = Ember.ArrayController.extend({
    addTodoList: function () {
        var transaction = App.store.transaction();

        var todoList = transaction.createRecord(App.TodoList, { title: "My todos", todos: [], userId: "to be replaced" });
        
        transaction.commit();

        //todo: it's hard to add the element to the beginning of ths list
        // may need to modify WebAPIAdapter.js didCreateRecord to handle the case to insert the 
        // the following will affect future transactions and cannot be used.
        //var self = this;
        //setTimeout(function () {
        //    var lists = self.get('content');
        //    var newTodoList = lists.popObject();
        //    lists.insertAt(0, newTodoList);
        //    newTodoList.set('isDirty', false);
        //}, 100);

    },
});