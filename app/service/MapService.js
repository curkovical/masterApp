Ext.define("masterApp.service.MapService", {
    singleton: true,

    getRoute: function(markerCoords, callback) {
        var coordsForService = '';
        for (var i = 0; i < markerCoords.length; i++) {
            coordsForService += markerCoords[i].join() + ';';
        }

        coordsForService = coordsForService.slice(0, -1);
        // var requestURL = Ext.String.format('{0}{1}{2}', 'http://router.project-osrm.org/route/v1/driving/', coordsForService);        
        Ext.Ajax.request({
            url: Ext.String.format('{0}{1}{2}', 'http://localhost:5000/route/v1/driving/', coordsForService),
            method: 'GET',
            cors: true,
            useDefaultXhrHeader: false,
            disableCaching: false,
            scope: this,
            unauthorized: true,
            params: {
                alternatives: true,
                geometries: 'geojson',
                overview: 'full',
                annotations: 'distance'
            },
            success: function(response, opts) {
                var routeData = Ext.JSON.decode(response.responseText);
                callback(routeData);
            },
            failure: function(response, opts) {
                console.log(response);
            }
        });
    },

    /*getLocationsFromText: function(query, callback) {
        var requestURL = 'https://nominatim.openstreetmap.org/search?q=' + query + '&format=json'
        Ext.Ajax.request({
            url: requestURL,
            method: 'GET',
            cors: true,
            // useDefaultXhrHeader: false,
            // disableCaching: false,
            scope: this,
            unauthorized: true,            
            success: function(response, opts) {
                var data = Ext.JSON.decode(response.responseText);
                callback(data);
            },
            failure: function(response, opts) {
                console.log(response);
            }
        });
    }*/

});
