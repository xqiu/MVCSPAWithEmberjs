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
            //var newTodo = new App.Todo({
            var newTodo = {
                title: this.get('newTodoTitle'),
                todoListId: this.id,
                isDone: false
            };
            transaction.createRecord(App.Todo, newTodo);

            transaction.commit();

            this.set('newTodoTitle', '');

            // todo: how to make the todoList update to show it?  The following doesn't work, need to refresh for now

            //this.get("todos").content.pushObject(newTodo);

            //if(callback){
            //   callback(newTodo); //call back 
            //}

            //var newTodos = self.get("todos");
            //newTodos.content.push(newTodo)
            //self.set("todos", newTodos);
        }
    },   //do not .observes('newTodoTitle'), as otherwise it will be called for every key change instead of focusout

});