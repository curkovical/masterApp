Ext.define("masterApp.service.MainService", {
    singleton: true,

    getAdrFromLatLon(coordinates, callback){        
        coordinates = ol.proj.toLonLat(coordinates);        
        let requestURL = 'https://nominatim.openstreetmap.org/reverse?lat=' + coordinates[1] + '&lon=' + coordinates[0] + '&format=json';
        Ext.Ajax.request({
            url: requestURL,
            method: 'GET',
            cors: true,
            // useDefaultXhrHeader: false,
            // disableCaching: false,
            scope: this,
            // unauthorized: true,
            params: {
                geometries: 'geojson'
            },
            success: function(response, opts) {                
                let data = Ext.JSON.decode(response.responseText);                
                callback(data.display_name);
            },
            failure: function(response, opts) {
                console.log(response);
            }
        });
    }
});
