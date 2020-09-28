Ext.define('masterApp.view.map.BridgeGrid', {
    extend: 'Ext.grid.property.Grid',    
    xtype: 'bridgegrid',
    id: 'bridgegrid',

    title: 'Bridge properties',    
    width: 300,
    height: 300,
    // autoShow: true,
    autoRender: true,
    
    bind: {
        hidden: '{bridgeGridHidden}',
        source: '{bridgeSelected}'
    },
    floating: true,
    
    listeners: {
        beforeEdit: function(){
            return false;
        },
        afterLayout: function(grid) {            
            grid.alignTo('mapPanel', 'br', [-310, -310]);
        },        
    }
});