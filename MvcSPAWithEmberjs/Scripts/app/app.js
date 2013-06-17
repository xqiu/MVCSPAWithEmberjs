window.App = Em.Application.create();

DS.WebAPIAdapter.map('App.TodoList', {
    // Web API server is not handling reference update/delete, so use "load" instead of "always"
    todos: { embedded: 'load' } 
});

var adapter = DS.WebAPIAdapter.create({
    namespace: "api",
    bulkCommit: false,
    antiForgeryTokenSelector: "#antiForgeryToken"
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
    adapter: adapter
});
