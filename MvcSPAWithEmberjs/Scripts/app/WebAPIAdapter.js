get = Ember.get;                      // ember-metal/accessors
DS.WebAPIAdapter = DS.RESTAdapter.extend({
    bulkCommit: false,
    since: 'since',
    //createTypesAtBeginning: [],

    serializer: DS.WebAPISerializer,
    
    shouldSave: function (record) {
        // Different with RESETAdapter, we always return true here, even if it's-referenced from parent
        return true;
    },

    //didCreateRecord: function (store, type, record, payload) {
    //    this._super(store, type, record, payload);
    //    for(specialType in get(this, 'createTypesAtBeginning')){
    //        if (type === specialType) {

    //        }
    //    }
    //},

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

    updateRecord: function (store, type, record) {
        var id = get(record, 'id');
        var root = this.rootForType(type);

        // Different with RESTAdapter, do not include the root for data 
        data = this.serialize(record, { includeId: true });

        this.ajax(this.buildURL(root, id), "PUT", {
            data: data,
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    this.didSaveRecord(store, type, record, json);
                });
                record.set("error", "");
            },
            error: function (xhr) {
                // Different with RESTAdapter, we act on client side as if it is successful, then set model's error attribute
                // this.didError(store, type, record, xhr);
                Ember.run(this, function () {
                    this.didSaveRecord(store, type, record);
                });
                record.set("error", "Server update failed");
            }
        });
    },
    
    deleteRecord: function (store, type, record) {
        var id = get(record, 'id');
        var root = this.rootForType(type);
        
        var config = get(this, 'serializer').configurationForType(type),
            primaryKey = config && config.primaryKey;

        this.ajax(this.buildURL(root, id), "DELETE", {
            context: this,
            success: function (json) {
                Ember.run(this, function () {
                    if (json[primaryKey] == id) {
                        // webAPI delete will just return the original record, in this case, we ignore it
                        this.didSaveRecord(store, type, record);
                    }
                    else {
                        this.didSaveRecord(store, type, record, json);
                    }
                });
            }
        });
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

        // todo:, if type == 'PUT', datatype should be text

        jQuery.ajax(hash);
    },

    pluralize: function (string) {
        return string;
    },

});

