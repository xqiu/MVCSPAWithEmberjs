App.TodoListView = Ember.View.extend({
    deleteTodoList: function (event) {
        var todoList = this.templateData.view.content;
        this.get('controller').deleteTodoList(todoList);
    },
});
