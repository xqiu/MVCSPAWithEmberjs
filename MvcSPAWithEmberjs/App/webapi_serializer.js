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

    // ember-data-1.0.0-beta2 does not handle embedded data like they once did in 0.13, so we've to define extractArray individually if present.
    // once embedded is implemented in future release, we'll move extractArray back to WebAPISerializer.
    // see https://github.com/emberjs/data/blob/master/TRANSITION.md for details

});

