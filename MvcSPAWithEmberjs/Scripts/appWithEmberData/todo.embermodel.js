/// <reference path="../ember-data-master01152013.js" />
get = Ember.get;                      // ember-metal/accessors

window.TodoEmberApp = Em.Application.create({
    rootElement: '#main-content',
    ready: function () {
        //Initialize the todoList
    }
});

(function () {
    DS.WebAPISerializer = DS.JSONSerializer.extend({
        keyForAttributeName: function (type, name) {
            //return Ember.String.decamelize(name);
            // Different with JsonSerializer, we do not do decamelize
            return name;
        },

        keyForBelongsTo: function (type, name) {
            var key = this.keyForAttributeName(type, name);

            if (this.embeddedType(type, name)) {
                return key;
            }

            return key + "_id";
        },

        extractMany: function (loader, json, type, records) {
            var root = this.rootForType(type);
            root = this.pluralize(root);
            var objects;

            // Different with JsonSerializer, we detect if returned json is Array
            if (json instanceof Array) {
                objects = json;
            }
            else
            {
                this.sideload(loader, type, json, root);
                this.extractMeta(loader, type, json);
                objects = json[root];
            }

            if (objects) {
                var references = [];
                if (records) { records = records.toArray(); }

                for (var i = 0; i < objects.length; i++) {
                    if (records) { loader.updateId(records[i], objects[i]); }
                    var reference = this.extractRecordRepresentation(loader, type, objects[i]);
                    references.push(reference);
                }

                loader.populateArray(references);
            }
        },

        extract: function (loader, json, type, record) {
            // Different with JsonSerializer, we don't have json[root] in the returned json data
            if (record) loader.updateId(record, json);
            this.extractRecordRepresentation(loader, type, json);
        },
        
        rootForType: function (type) {
            var typeString = type.toString();

            Ember.assert("Your model must not be anonymous. It was " + type, typeString.charAt(0) !== '(');

            // use the last part of the name as the URL
            var parts = typeString.split(".");
            var name = parts[parts.length - 1];
            //return name.replace(/([A-Z])/g, '_$1').toLowerCase().slice(1);
            return name.toLowerCase();
        },

    });
    
})();

DS.WebAPIAdapter = DS.Adapter.extend({
    bulkCommit: false,
    since: 'since',

    serializer: DS.WebAPISerializer,

    init: function () {
        this._super.apply(this, arguments);
    },

    shouldSave: function (record) {
        var reference = get(record, '_reference');

        return !reference.parent;
    },

    createRecord: function (store, type, record) {
        var root = this.rootForType(type);

        // Different with RESTAdapter, do not include the root for data 
        var data = this.serialize(record, { includeId: false });

        // Different with RESTAdapter, we need to remove the primaryKey field
        var config = get(this, 'serializer').configurationForType(type),
            primaryKey = config && config.primaryKey;

        if (primaryKey) {
            delete data[primaryKey];
        }

        this.ajax(this.buildURL(root), "POST", {
            data: data,
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    this.didCreateRecord(store, type, record, json);
                });
            },
            error: function (xhr) {
                this.didError(store, type, record, xhr);
            }
        });
    },

    dirtyRecordsForRecordChange: function (dirtySet, record) {
        dirtySet.add(record);

        get(this, 'serializer').eachEmbeddedRecord(record, function (embeddedRecord, embeddedType) {
            if (embeddedType !== 'always') { return; }
            if (dirtySet.has(embeddedRecord)) { return; }
            this.dirtyRecordsForRecordChange(dirtySet, embeddedRecord);
        }, this);

        var reference = record.get('_reference');

        if (reference.parent) {
            var store = get(record, 'store');
            var parent = store.recordForReference(reference.parent);
            this.dirtyRecordsForRecordChange(dirtySet, parent);
        }
    },

    dirtyRecordsForHasManyChange: Ember.K,

    createRecords: function (store, type, records) {
        if (get(this, 'bulkCommit') === false) {
            return this._super(store, type, records);
        }

        var root = this.rootForType(type),
            plural = this.pluralize(root);

        var data = {};
        data[plural] = [];
        records.forEach(function (record) {
            data[plural].push(this.serialize(record, { includeId: true }));
        }, this);

        this.ajax(this.buildURL(root), "POST", {
            data: data,
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    this.didCreateRecords(store, type, records, json);
                });
            }
        });
    },

    updateRecord: function (store, type, record) {
        var id = get(record, 'id');
        var root = this.rootForType(type);
        
        //var data = {};
        //data[root] = this.serialize(record);
        data = this.serialize(record, { includeId: true });

        this.ajax(this.buildURL(root, id), "PUT", {
            data: data,
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    this.didSaveRecord(store, type, record, json);
                });
            },
            error: function (xhr) {
                this.didError(store, type, record, xhr);
            }
        });
    },
    
    deleteRecord: function (store, type, record) {
        var id = get(record, 'id');
        var root = this.rootForType(type);

        this.ajax(this.buildURL(root, id), "DELETE", {
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    this.didSaveRecord(store, type, record, json);
                });
            }
        });
    },

    find: function (store, type, id) {
        var root = this.rootForType(type);

        this.ajax(this.buildURL(root, id), "GET", {
            success: function (json) {
                Ember.run(this, function () {
                    this.didFindRecord(store, type, json, id);
                });
            }
        });
    },


    /**
      Loads the response to a request for all records by type.
  
      You adapter should call this method from its `findAll`
      method with the response from the backend.
  
      @param {DS.Store} store
      @param {subclass of DS.Model} type
      @param {any} payload 
    */
    didFindAll: function (store, type, payload) {
        var loader = DS.loaderFor(store),
            serializer = get(this, 'serializer');

        store.didUpdateAll(type);

        // todo: why the above call tries to update the todoItems that are seralized?  should we call store.didSaveRecords(type) instead?

        serializer.extractMany(loader, payload, type);
    },

    findAll: function (store, type, since) {
        var root = this.rootForType(type);

        this.ajax(this.buildURL(root), "GET", {
            data: this.sinceQuery(since),
            success: function (json) {
                Ember.run(this, function () {
                    this.didFindAll(store, type, json);
                });
            }
        });
    },

    /**
      @private
  
      This method serializes a list of IDs using `serializeId`
  
      @returns {Array} an array of serialized IDs
    */
    serializeIds: function (ids) {
        var serializer = get(this, 'serializer');

        return Ember.EnumerableUtils.map(ids, function (id) {
            return serializer.serializeId(id);
        });
    },

    didError: function (store, type, record, xhr) {
        if (xhr.status === 422) {
            var data = JSON.parse(xhr.responseText);
            store.recordWasInvalid(record, data['errors']);
        } else {
            this._super.apply(this, arguments);
        }
    },

    ajax: function (url, type, hash) {
        hash.url = url;
        hash.type = type;
        hash.dataType = 'json';
        hash.contentType = 'application/json; charset=utf-8';
        hash.context = this;

        if (hash.data && type !== 'GET') {
            hash.data = JSON.stringify(hash.data);
        }

        jQuery.ajax(hash);
    },
    
    rootForType: function (type) {
        var serializer = get(this, 'serializer');
        return serializer.rootForType(type);
    },

    pluralize: function (string) {
        var serializer = get(this, 'serializer');
        //return serializer.pluralize(string);
        return string;
    },

    buildURL: function (record, suffix) {
        var url = [this.url];

        Ember.assert("Namespace URL (" + this.namespace + ") must not start with slash", !this.namespace || this.namespace.toString().charAt(0) !== "/");
        Ember.assert("Record URL (" + record + ") must not start with slash", !record || record.toString().charAt(0) !== "/");
        Ember.assert("URL suffix (" + suffix + ") must not start with slash", !suffix || suffix.toString().charAt(0) !== "/");

        if (this.namespace !== undefined) {
            url.push(this.namespace);
        }

        //url.push(this.pluralize(record));
        url.push(record);
        if (suffix !== undefined) {
            url.push(suffix);
        }

        return url.join("/");
    },

    sinceQuery: function (since) {
        var query = {};
        query[get(this, 'since')] = since;
        return since ? query : null;
    }
});

//define WebAPIAdapter and data store
//DS.WebAPIAdapter.configure("plurals", {
//    todo: "todo",
//    todo_list: "todoList"
//});

DS.WebAPIAdapter.map('TodoEmberApp.TodoList', {
    todos: { embedded: 'always' }
});

DS.WebAPIAdapter.map('TodoEmberApp.TodoList', {
    id: { key: 'todoListId' }
});

DS.WebAPIAdapter.map('TodoEmberApp.Todo', {
    id: { key: 'todoItemId' }
});

var adapter = DS.WebAPIAdapter.create({
    namespace: "api",
    bulkCommit: false,
    //mappings: { //http://stackoverflow.com/questions/12182866/ember-data-how-do-mappings-work
    //    'todoList': 'TodoEmberApp.TodoList'
    //},

});

var serializer = Ember.get(adapter, 'serializer');
serializer.configure('TodoEmberApp.TodoList', {
    sideloadAs: "todoList",
    primaryKey: "todoListId"
});
serializer.configure('TodoEmberApp.Todo', {
    sideloadAs: "todo",
    primaryKey: "todoItemId"
});


//TodoEmberApp.Store = DS.Store.extend({ adapter: adapter, revision: 11 });
TodoEmberApp.store = DS.Store.create({
    adapter: adapter,
    revision: 11
});

//define models
var attr = DS.attr;
TodoEmberApp.TodoList = DS.Model.extend();
TodoEmberApp.Todo = DS.Model.extend({
    todoItemId: attr('number'),
    title: attr('string'),
    isDone: attr('boolean'),
    todoListId: attr('number'),
    error: attr('string'),
    //todoList: DS.belongsTo('TodoEmberApp.TodoList'),

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),

    saveCheckbox: function () {

        // todo: direct commmit will send update for the todoList instead of todo item, what to do?
        TodoEmberApp.store.commit();
        //var newIsDone = this.get("isDone");
        //TodoEmberApp.store.rollback();
        //var transaction = TodoEmberApp.store.transaction();
        //transaction.add(this);
        //this.set("isDone", newIsDone);
        //transaction.commit();
    }.observes('isDone'),
    
    toJson: function () {
        var self = this;
        return JSON.stringify({
            //todoItemId: self.todoItemId,
            id: self.id,
            title: self.title,
            isDone: self.isDone,
            todoListId: self.todoListId
        });
    }
});

TodoEmberApp.TodoList.reopen({
    todoListId: attr('number'),
    title: attr('string'),
    userId: attr('string'),
    todos: DS.hasMany('TodoEmberApp.Todo'),
    
    newTodoTitle: '',
    error: '',

    errorMessage: function (errorMsg) {
        this.set("error", errorMsg);
    },

    hasError: function () {
        var currentError = this.get("error");
        return !(currentError === '' || currentError === null);
    }.property('error'),
    
    addTodo: function (callback) {
        var self = this;
        if (self.get('newTodoTitle')) { // need a title to save
            var transaction = TodoEmberApp.store.transaction();
            var newTodo = {
                title: self.get('newTodoTitle'),
                todoListId: self.id,
                isDone: false
            };
            transaction.createRecord(TodoEmberApp.Todo, newTodo);

            this.get("todos").content.pushObject(newTodo);

            transaction.commit();

            self.set('newTodoTitle', '');

            // todo: how to make the todoList update to show it?  The following doesn't work, need to refresh for now
            //callback(newTodo); //call back 

            //var newTodos = self.get("todos");
            //newTodos.content.push(newTodo)
            //self.set("todos", newTodos);

        }
    },   //do not .observes('newTodoTitle'), as otherwise it will be called for every key change instead of focusout

    //deleteTodoList: function (event) {
    //    this.get('content').deleteRecord();
    //    this.transaction.commit();
    //},

    toJson: function () {
        var self = this;
        return JSON.stringify({
            //todoListId: self.todoListId,
            id: self.id,
            userId: self.userId,
            title: self.title,
            todo: [],
            isEditingListTitle: true,
        });
    }
});

