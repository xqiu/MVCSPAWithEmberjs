//// datacontext call back functions, so that different framework (e.g. knockoutjs and emberjs) can use the same datacontext.js file
//(function (ember, datacontext) {

//    datacontext.todoItem = todoItem;
//    datacontext.todoList = todoList;

//    function todoItem(data) {
//        var self = this;
//        data = data || {};
//        return App.TodoItem.create({
//            todoItemId: data.todoItemId,
//            title: data.title,
//            isDone: data.isDone,
//            todoListId: data.todoListId,
//        });
//    };

//    function todoList(data) {

//        var self = this;
//        data = data || {};

//        var ret = App.TodoList.create({
//            todoListId: data.todoListId,
//            userId: data.userId || "to be replaced",
//            title: data.title || "My todos",
//            todos: importTodoItems(data.todos),

//            isEditingListTitle: false,
//            newTodoTitle: '',
//        });

//        return ret;
//    };

//    // convert raw todoItem data objects into array of TodoItems
//    function importTodoItems(todoItems) {
//        return $.map(todoItems || [],
//                function (todoItemData) {
//                    return datacontext.createTodoItem(todoItemData);
//                });
//    }

//})(Ember, todoApp.datacontext);

//(function () {

//    window.datahelper = Ember.ArrayProxy.create({
//        content: [],
//        isLoaded: false,
//        error: "",
//        findTodoList: function (todoListId) {
//            for (var i = 0; i < this.content.length; i++) {
//                if (this.content[i].todoListId === todoListId) {
//                    return this.content[i];
//                }
//            }
//            return undefined;
//        },
//        loadTodoList: function () {
//            var self = this;
//            self.isLoaded = true;
//            datacontext.getTodoLists(
//                function (mappedTodoLists) {
//                    for (var i = 0; i < mappedTodoLists.length; i++) {
//                        self.pushObject(mappedTodoLists[i]);
//                    }
//                },
//                function (error) {
//                    self.error = error;
//                }
//            );
//        }
//    });
//})();

