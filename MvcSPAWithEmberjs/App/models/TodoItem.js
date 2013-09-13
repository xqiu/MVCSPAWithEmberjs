var attr = DS.attr;
App.TodoList = DS.Model.extend();
App.Todo = DS.Model.extend({
    todoItemId: attr('number'),
    title: attr('string'),
    isDone: attr('boolean'),
    todoListId: attr('number'),
    error: attr('string'),
    todoList: DS.belongsTo('todoList'),
    
    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),

    saveCheckbox: function () {
        var self = this;
        if (this.get("isDirty")) {
            if (this.get("todoItemId")) {
                self.set('error', '');
                this.save().then(function () {
                    // we break the PUT ajax call that we don't call back this resolve function.  see webapi_adapter.js ajax call for detail
                }, function (data) {
                    self.set('error', "error saving " + data.message);
                });
            }
        }
    }.observes('isDone'),

});

App.TodoSerializer = DS.WebAPISerializer.extend({
    primaryKey: 'todoItemId'
});
