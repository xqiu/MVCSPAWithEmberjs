var attr = DS.attr;
//App.TodoList defined in TodoItem.js
App.TodoList.reopen({
    todoListId: attr('number'),
    title: attr('string'),
    userId: attr('string'),
    todos: DS.hasMany('todo'),

    newTodoTitle: '',
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError == null);
    }.property('error'),

});

App.TodoListSerializer = DS.WebAPISerializer.extend({
    primaryKey: 'todoListId',

    // ember-data-1.0.0-beta2 does not handle embedded data like they once did in 0.13, so we've to update individually if present
    // once embedded is implemented in future release, we'll move this back to WebAPISerializer.
    // see https://github.com/emberjs/data/blob/master/TRANSITION.md for details
    extractArray: function (store, primaryType, payload) {
        var primaryTypeName = primaryType.typeKey;

        var typeName = primaryTypeName,
            type = store.modelFor(typeName);
        
        var data = {};
        data[typeName] = payload;
        data.todos = [];
        
        var normalizedArray = payload.map(function (hash) {
            hash.todos.map(function (todo) {
                data.todos.push(todo);
            });
            hash.todos = hash.todos.mapProperty('todoItemId');
            return hash;
        }, this);
        
        payload = data;
        return this._super.apply(this, arguments);
    },
    
    normalizeHash: {
        todos: function (hash) {
            hash.todoListId = hash.id;
            hash.id = hash.todoItemId;
            return hash;
        },
        todoList: function (hash) {
            hash.todoListId = hash.id;
            return hash;
        }
    }

});
