App.Router.map(function () {
    this.route("index", { path: "/" });
    this.route("about");
    this.route("todoLists", { path: "/todo" });
    this.resource("todoList", { path: "/todoList/:todoList_id" });
});