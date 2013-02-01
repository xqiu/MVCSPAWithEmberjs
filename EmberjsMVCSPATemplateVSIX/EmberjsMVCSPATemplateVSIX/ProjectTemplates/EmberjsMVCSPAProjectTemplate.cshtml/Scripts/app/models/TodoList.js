var attr = DS.attr;
//App.TodoList defined in TodoItem.js
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

            //Issue: 
            // the following order will some times trigger error in a taskList, looks like ember-data state management problem
            // add a new todo
            // update the content of that todo
            // delete this todo
            // add a new todo
            // update the content again
        }
    },   //do not .property('newTodoTitle'), as otherwise it will be called for every key change instead of focusout

});