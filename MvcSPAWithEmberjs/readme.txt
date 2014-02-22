Changes started 2/21/2014, for VSIX 1.4.2
1. Made change to HtmlHelperExtensions to make default tempalte name be folderName/templateFileName, to make it match ember.js's default
2. Add demo to route to todoList/:todoList_id by clicking a => button for a todoList, renamed TodoListController.js to TodoListsController.js, renamed todoList.hbs to todoLists.hbs and removed TodoListView inside, created new TodoListController.js and todoList/index.hbs, 
3. Add extractSingle in TodoList.js, make TodoListSerializer extend from RESTSerializer to make it work for new route
4. Modified a bit to handle delete todoItem, make it simplified, ignore checkbox event if the item is deleted.

Changes started 2/6/2014:
1. Made a workaround to get csharp-ember-handlebars-compiler working properly when bundling
2. Upgrade csharp-ember-handlebars-compiler package to 1.5.0-beta1
3. Update VSIX to 1.4.1
4. Renamed VSIX project directory name as it's too long, and caused VSIX build problem
5. Truely make EntityFramework in VSIX using 5.0.0 package to make it compatible with VS2012 update 2.

Changes started from 2/3/2014:
1. Update ember.js to 1.3.0, ember-data to 1.0.0-beta6, handlebars to 1.1.2
2. Change application.hbs
	{{partial navbar}}
   to
    {{partial 'navbar'}}
   to make it work properly.  Seems new handlebars no longer allow the old way of doing partial.
3. Update webapi.client and EntityFramework packages to the one shipped with VS2012 update 2
4. move todos normalizeHash to todo serializer, as ember data changes
5. todo.saveCheckbox should not check the isDirty attribute as this version of ember data
6. Update VSIX to 1.4
