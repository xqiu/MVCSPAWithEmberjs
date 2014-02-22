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

App.TodoListSerializer = DS.RESTSerializer.extend({
    primaryKey: 'todoListId',

    //// ember-data-1.0.0-beta2 does not handle embedded data like they once did in 0.13, so we've to update individually if present
    //// once embedded is implemented in future release, we'll move this back to WebAPISerializer.
    //// see https://github.com/emberjs/data/blob/master/TRANSITION.md for details
    extractArray: function (store, primaryType, payload) {
        var primaryTypeName = primaryType.typeKey;

        var typeName = primaryTypeName,
            type = store.modelFor(typeName);
        
        var data = {};
        data[typeName] = payload;
        data.todos = [];
        
        // Make the todos as a separate payload for extract Array to work on, 
        // this is to get the format the same as ember-data default has many relationship arrays
        payload.map(function (hash) {
            hash.todos.map(function (todo) {
                data.todos.push(todo); //add the todos to the data
            });
            hash.todos = hash.todos.mapProperty('todoItemId');
        }, this);
        
        payload = data;
        return this._super.apply(this, arguments);
    },

    extractSingle: function (store, primaryType, payload, recordId, requestType) {
        var primaryTypeName = primaryType.typeKey;
        var typeName = primaryTypeName;
        var data = {};
        data[typeName] = payload;
        data.todos = [];

        if(payload.todos != null){
            payload.todos.map(function (todo) {
                todo.id = todo.todoItemId;
                todo.type = App.Todo;
                data.todos.push(todo);
            });
            payload.todos = payload.todos.mapProperty('todoItemId');
        }
        else {
            payload.todos = [];
        }

        payload = data;
        return this._super.apply(this, arguments);
    },

    normalizeHash: {
        todoList: function (hash) {
            hash.todoListId = hash.id;
            return hash;
        }
    }

});
