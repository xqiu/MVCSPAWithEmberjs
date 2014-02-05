//require('ember-data/serializers/json_serializer');
var get = Ember.get;

DS.WebAPISerializer = DS.RESTSerializer.extend({

    extractSingle: function (store, primaryType, payload, recordId, requestType) {
        var primaryTypeName = primaryType.typeKey;
        var typeName = primaryTypeName;
        var data = {};
        data[typeName] = payload;

        payload = data;
        return this._super.apply(this, arguments);
    },

});

