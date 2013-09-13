//require("ember-data/core");
//require('ember-data/system/adapter');
//require('ember-data/adapater/rest_adapter');
//require('ember-data/serializers/webapi_serializer');
/*global jQuery*/

var get = Ember.get;
var forEach = Ember.ArrayPolyfills.forEach;

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
    App.ApplicationAdapter = DS.WebAPIAdapter.extend({
        namespace: 'api',
        antiForgeryTokenSelector: "#antiForgeryToken",
    });
  ```
*/

DS.WebAPIAdapter = DS.RESTAdapter.extend({
    defaultSerializer: "DS/WebAPI", //Ember.Data 1.0 beta 1 way

    createRecord: function (store, type, record) {
        var data = {};
        data = store.serializerFor(type.typeKey).serialize(record, { includeId: false });

        var primaryKey = store.serializerFor(type.typeKey).primaryKey;
        if (primaryKey) {
            delete data[primaryKey];
        }

        return this.ajax(this.buildURL(type.typeKey), "POST", { data: data });
    },

    updateRecord: function (store, type, record) {
        var data = {};
        data = store.serializerFor(type.typeKey).serialize(record);

        var id = get(record, 'id');

        return this.ajax(this.buildURL(type.typeKey, id), "PUT", { data: data }, record);
    },

    ajax: function(url, type, hash, record) {
        // if antiForgeryTokenSelector attribute exists, pass it in the header
        var antiForgeryTokenElemSelector = get(this, 'antiForgeryTokenSelector');
        if (antiForgeryTokenElemSelector) {
            var antiForgeryToken = $(antiForgeryTokenElemSelector).val();
            if (antiForgeryToken) {
                this.headers = {
                    'RequestVerificationToken': antiForgeryToken
                }
            }
        }
        
        var adapter = this;

        return new Ember.RSVP.Promise(function(resolve, reject) {
            hash = hash || {};
            hash.url = url;
            hash.type = type;
            hash.dataType = 'json';
            hash.context = adapter;

            if (hash.data && type !== 'GET') {
                hash.contentType = 'application/json; charset=utf-8';
                hash.data = JSON.stringify(hash.data);
            }

            if (adapter.headers !== undefined) {
                var headers = adapter.headers;
                hash.beforeSend = function (xhr) {
                    forEach.call(Ember.keys(headers), function(key) {
                        xhr.setRequestHeader(key, headers[key]);
                    });
                };
            }

            hash.success = function (json) {
                if (json === undefined && type === "PUT") {
                    // if PUT and returns no data, treat specially, don't let resolve to override our data
                    // Bug here: due to ember-data limitness, we cannot just resolve empty returns.  We simply do a commit and forget about the 
                    // calling then.  Should be fixed by ember-data.js.
                    record.send('didCommit');
                }
                else {
                    Ember.run(null, resolve, json);
                }
            };

            hash.error = function(jqXHR, textStatus, errorThrown) {
                if (jqXHR) {
                    jqXHR.then = null;
                }

                Ember.run(null, reject, jqXHR);
            };

            Ember.$.ajax(hash);
        });
    },

    rootForType: function (type) {
        return type;
    },

});

