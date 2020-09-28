/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('masterApp.view.main.Main', {
    extend: 'Ext.panel.Panel',
    xtype: 'app-main',

    requires: [
        'Ext.plugin.Viewport',
        'Ext.window.MessageBox',

        'masterApp.view.main.MainController',
        'masterApp.view.main.MainModel',        
        'masterApp.view.map.Map',
        'masterApp.view.map.RouteGrid'
    ],

    controller: 'main',
    viewModel: 'main',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },
        
    items: [{
        xtype: 'mapHeader',
    }, {
        xtype: 'panel',
        flex: 1,
        viewModel: {
            type: 'map'
        },
        layout: 'fit',
        items: [{
            xtype: 'mappanel',
        }, {
            xtype: 'routegrid'
        }, {
            xtype: 'bridgegrid'
        }]
    }],
    
    listeners: {
        resize: function(panel){
            if (panel.down('routegrid').rendered == true){
                panel.down('routegrid').alignTo('mapPanel', 'tr', [-210, 10]);
            }
            if (panel.down('bridgegrid').rendered == true){
                panel.down('bridgegrid').alignTo('mapPanel', 'br', [-310, -310]);
            }            
        }
    }
});
