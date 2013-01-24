App.TodoListEditView = Em.TextField.extend({
    lastValue: '',
    ////todo: see if we can use validate inside init function instead of calling focusIn and keyUp
    //init: function () {
    //    this._super();
    //    $(this).parent("form").validate();  //initialize jquery.validate
    //},
    focusIn: function (evt) {
        $(evt.target).parent("form").validate();  //initialize jquery.validate
        this.lastValue = this.get('parentView').templateData.view.content.get("title");
    },
    focusOut: function (evt) {
        this.changeContent();
    },

    insertNewline: function (evt) {
        $(evt.target).parent("form").validate();  //calling jquery.validate
        $(evt.target).blur();
    },

    changeContent: function () {
        var todoList = this.get('parentView').templateData.view.content;
        var newValue = todoList.get("title");
        if (this.lastValue != newValue) {
            App.store.commit();
            this.lastValue = newValue;
        }
    }
});