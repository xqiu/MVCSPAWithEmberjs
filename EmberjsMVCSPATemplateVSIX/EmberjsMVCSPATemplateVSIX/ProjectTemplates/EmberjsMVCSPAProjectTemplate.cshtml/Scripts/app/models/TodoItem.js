App.Todo = Ember.Object.extend({
    todoItemId: 0,
    title: '',
    isDone: false,
    todoListId: 0,
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    saveCheckbox: function () {
        var self = this;
        return window.todoApp.datacontext.saveChangedTodoItem(self);
    }.observes('isDone'),

    toJson: function () {
        var self = this;
        return JSON.stringify({
            todoItemId: self.todoItemId,
            title: self.title,
            isDone: self.isDone,
            todoListId: self.todoListId
        });
    }
});

(function (ember, datacontext) {

    datacontext.todoItem = todoItem;

    function todoItem(data) {
        var self = this;
        data = data || {};
        return App.Todo.create({
            todoItemId: data.todoItemId,
            title: data.title,
            isDone: data.isDone,
            todoListId: data.todoListId,
        });
    };

})(Ember, todoApp.datacontext);

