window.App = Em.Application.create();

DS.WebAPIAdapter.map('App.TodoList', {
    todos: { embedded: 'always' }
});

DS.WebAPIAdapter.map('App.TodoList', {
    id: { key: 'todoListId' }
});

DS.WebAPIAdapter.map('App.Todo', {
    id: { key: 'todoItemId' }
});

var adapter = DS.WebAPIAdapter.create({
    namespace: "api",
    bulkCommit: false,
});

var serializer = Ember.get(adapter, 'serializer');
serializer.configure('App.TodoList', {
    sideloadAs: "todoList",
    primaryKey: "todoListId"
});
serializer.configure('App.Todo', {
    sideloadAs: "todo",
    primaryKey: "todoItemId"
});

App.store = DS.Store.create({
    adapter: adapter,
    revision: 11
});
