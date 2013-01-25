var attr = DS.attr;
//App.TodoList = DS.Model.extend({
App.TodoList.reopen({
    todoListId: attr('number'),
    title: attr('string'),
    userId: attr('string'),
    todos: DS.hasMany('App.Todo'),

    newTodoTitle: '',
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    addTodo: function (callback) {
        if (this.get('newTodoTitle')) { // need a title to save
            var transaction = App.store.transaction();
            var newTodo = transaction.createRecord(App.Todo, {
                title: this.get('newTodoTitle'),
                todoListId: this.id,
                isDone: false
            });

            var todoList = App.store.find(App.TodoList, this.id);
            todoList.get('todos').addObject(newTodo);

            transaction.commit();
            this.set('newTodoTitle', '');
        }
    },   //do not .observes('newTodoTitle'), as otherwise it will be called for every key change instead of focusout

});