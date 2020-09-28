Ext.define('masterApp.view.main.MapHeader', {
    extend: 'Ext.panel.Panel',
    xtype: 'mapHeader',
    height: 60,
    style: {
        padding: 10
    },
    bodyStyle: {
        backgroundImage: 'linear-gradient(to right, gray, black)',        
    },

    layout: {
        type: 'hbox',
        align: 'middle',
        padding: '10'
    },    

    items: [{
        xtype: 'combo',
        name: 'start',
        flex: 2,        
        style: {
            marginRight: '10px'
        },        
        listeners: {
            specialkey: 'locationEntered',
            select: 'pinComboRecordSelected',                   
        },
        displayField: 'display_name',
        queryMode: 'local',
        bind: {
            store: '{startCmbStore}',
            value: '{startCmb.value}'
        },
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-exchange',
        style: 'marginRight: 10px',
        handler: 'swapMarkers',
        bind: {
            disabled: '{swapDisabled}'
        }
    }, {
        xtype: 'combo',
        flex: 2,
        name: 'end',
        listeners: {
            specialkey: 'locationEntered',
            select: 'pinComboRecordSelected',
        },
        displayField: 'display_name',
        queryMode: 'local',
        bind: {
            store: '{endCmbStore}',
            value: '{endCmb.value}'
        }
    }, {
        flex: 4
    }, {
        xtype: 'combo',
        flex: 1,
        forceSelection: true,
        editable: false,
        store: {
            fields: ['type'],
            data: [
                {type: 'single'}, 
                {type: 'combined'}
            ]
        },
        displayField: 'type',
        valueField: 'type',
        bind: {
            value: '{vehicleType}'
        },
        style: {
            'marginRight': '10px'
        },
        listeners: {
            select: 'vtypeChanged',
            expand: function(cmb){
                cmb.setValue('');
            }
        }
    }, {
        xtype: 'numberfield',
        flex: 0.5,
        emptyText: 'weight',
        minValue: 0,
        bind: {
            value: '{vehicleWeight}'
        },
    }]

});
