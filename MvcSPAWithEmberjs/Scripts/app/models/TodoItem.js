var attr = DS.attr;
App.TodoList = DS.Model.extend();
App.Todo = DS.Model.extend({
    todoItemId: attr('number'),
    title: attr('string'),
    isDone: attr('boolean'),
    todoListId: attr('number'),
    error: attr('string'),
    todoList: DS.belongsTo('App.TodoList'),

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    saveCheckbox: function () {
        if(this.get("isDirty")){
            if (this.get("todoItemId")) {
                App.store.commit();
            }
        }
    }.observes('isDone'),

});