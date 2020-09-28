Ext.define('masterApp.view.map.MapModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.map',    

    data: {
        name: 'masterApp',            
        bridgeGridVisible: false,        
        routeGridHidden: true,
        bridgeGridHidden: true
    },

    formulas: {
        routeGridHidden: function(get) {            
            if (get('routeSelected') == null)
                return true;
            return false;
        },
        bridgeGridHidden: function(get) {
            if (get('bridgeSelected') == null)
                return true;
            return false;
        }
    }

    //TODO - add data, formulas and/or methods to support your view
});