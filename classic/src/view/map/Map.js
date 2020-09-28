Ext.define('masterApp.view.map.Map', {
    extend: 'GeoExt.component.Map',
    xtype: 'mappanel',
    requires: [
        'masterApp.view.map.MapController',
        'masterApp.view.map.MapModel',
        'masterApp.view.map.BridgeGrid'
    ],

    controller: 'map',
    
    id: 'mapPanel'

});