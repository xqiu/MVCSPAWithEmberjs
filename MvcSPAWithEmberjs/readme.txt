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
