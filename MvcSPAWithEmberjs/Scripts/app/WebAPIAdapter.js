get = Ember.get;                      // ember-metal/accessors
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

