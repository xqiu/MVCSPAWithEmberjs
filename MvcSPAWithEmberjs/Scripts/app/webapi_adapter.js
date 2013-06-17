//require("ember-data/core");
//require('ember-data/system/adapter');
//require('ember-data/adapater/rest_adapter');
//require('ember-data/serializers/webapi_serializer');
/*global jQuery*/

var get = Ember.get;

/**
  The WebAPI adapter allows your store to communicate with a REST server 
  powered by ASP.NET MVC WebAPI. 

  This adapter is designed to work with ASP.NET MVC WebAPI which is open data compatible.

  ## JSON Structure

  The WebAPI adapter expects the JSON returned from your server to follow
  ASP.NET WebAPI conventions.

  ### Object Root should not present

  The JSON payload should be an object that contains the record without a
  root property. For example, in response to a `GET` request for
  `/posts/1`, the JSON should look like this:

  ```js
  {
    title: "I'm Running to Reform the W3C's Tag",
    author: "Yehuda Katz"
  }
  ```

  ### No Conventional Names required

  Attribute names in your JSON payload should not be the underscored versions of
  the attributes in your Ember.js models.

  For example, if you have a `Person` model:

  ```js
  App.Person = DS.Model.extend({
    firstName: DS.attr('string'),
    lastName: DS.attr('string'),
    occupation: DS.attr('string')
  });
  ```

  The JSON returned should look like this:

  ```js
  {
    "firstName": "Barack",
    "lastName": "Obama",
    "occupation": "President"
  }
  ```
  
  ## Major differences with default RESTAdapter implementation
  
  ### Parent updates do not handle children updates by default
  
  ### Create a new object, JSON does not send primary key field
    
  ### Delete object, ignore the returned object if it has the same primary key as the object we passed
      Delete parent does not dirty the children.

  ### Update object, handle failure via commit and set error attribute, in order to prevent future failures

  ### if antiForgeryTokenSelector is defined, will include it in the ajax request sent

  ## Usage
  
  ```js
    window.App = Em.Application.create();

    DS.WebAPIAdapter.map('App.TodoList', {
        // Web API server may not handling reference update/delete, so use "load" instead of "always"
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
        adapter: adapter,
    });
  ```
*/

function rejectionHandler(reason) {
    Ember.Logger.error(reason, reason.message);
    throw reason;
}

DS.WebAPIAdapter = DS.RESTAdapter.extend({
    serializer: DS.WebAPISerializer,
    antiForgeryTokenSelector: null,

    shouldSave: function (record) {
        // By default Web API doesn't handle children update from parent.
        return true;
    },

    // Delete parent records does not dirty the children records
    dirtyRecordsForBelongsToChange: null,

    createRecord: function (store, type, record) {
        var root = this.rootForType(type);
        var adapter = this;

        var data = this.serialize(record, { includeId: false });

        // need to remove the primaryKey field
        var config = get(this, 'serializer').configurationForType(type),
            primaryKey = config && config.primaryKey;

        if (primaryKey) {
            delete data[primaryKey];
        }

        return this.ajax(this.buildURL(root), "POST", {
            data: data
        }).then(function (json) {
            adapter.didCreateRecord(store, type, record, json);
        }, function (xhr) {
            adapter.didError(store, type, record, xhr);
            throw xhr;
        }).then(null, rejectionHandler);
    },

    updateRecord: function (store, type, record) {
        var id = get(record, 'id');
        var adapter = this;
        var root = this.rootForType(type);

        data = this.serialize(record, { includeId: true });

        return this.ajax(this.buildURL(root, id), "PUT", {
            data: data
        }, "text").then(function (json) {
            adapter.didSaveRecord(store, type, record, json);
            record.set("error", "");
        }, function (xhr) {
            adapter.didSaveRecord(store, type, record);
            record.set("error", "Server update failed");
        }).then(null, rejectionHandler);

    },

    deleteRecord: function (store, type, record) {
        var id = get(record, 'id');
        var adapter = this;
        var root = this.rootForType(type);

        var config = get(this, 'serializer').configurationForType(type),
            primaryKey = config && config.primaryKey;

        return this.ajax(this.buildURL(root, id), "DELETE").then(function (json) {
            if (json[primaryKey] == id) {
                // webAPI delete will just return the original record, shouldn't save it back
                // ignore the returned json object
                adapter.didSaveRecord(store, type, record);
            }
            else {
                adapter.didSaveRecord(store, type, record, json);
            }
        }, function (xhr) {
            adapter.didError(store, type, record, xhr);
            throw xhr;
        }).then(null, rejectionHandler);
    },

    ajax: function (url, type, hash, dataType) {
        var adapter = this;

        return new Ember.RSVP.Promise(function (resolve, reject) {
            hash = hash || {};
            hash.url = url;
            hash.type = type;
            hash.dataType = dataType || 'json';
            hash.context = adapter;

            if (hash.data && type !== 'GET') {
                hash.contentType = 'application/json; charset=utf-8';
                hash.data = JSON.stringify(hash.data);
            }

            // if antiForgeryTokenSelector attribute exists, pass it in the hearder
            var antiForgeryTokenElemSelector = get(adapter, 'antiForgeryTokenSelector');
            if (antiForgeryTokenElemSelector) {
                var antiForgeryToken = $(antiForgeryTokenElemSelector).val();
                if (antiForgeryToken) {
                    hash.headers = {
                        'RequestVerificationToken': antiForgeryToken
                    }
                }
            }

            hash.success = function (json) {
                Ember.run(null, resolve, json);
            };

            hash.error = function (jqXHR, textStatus, errorThrown) {
                Ember.run(null, reject, errorThrown);
            };

            jQuery.ajax(hash);
        });
    },

    pluralize: function (string) {
        return string;
    },

});

