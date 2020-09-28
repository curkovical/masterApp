Ext.define('masterApp.view.map.RouteGrid', {
    extend: 'Ext.grid.property.Grid',    
    xtype: 'routegrid',
    id: 'routegrid',    
    title: 'Route Info',
    
    width: 200,    
    floating: true,    
    sortableColumns: false,
    hideHeaders: true,
    
    listeners: {
        beforeEdit: function(){
            return false;
        },
        afterLayout: function(grid) {
            grid.alignTo('mapPanel', 'tr', [-210, 10]);
        },
    },
    
    bind: {
        hidden: '{routeGridHidden}',
        source: '{routeSelected}'
    },
    
});
