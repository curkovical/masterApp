Ext.define('masterApp.store.comboStore', {
    extend: 'Ext.data.Store',    
    alias: 'store.comboStore',
    
    autoLoad: false,    
    proxy: {
        type: 'ajax',        
        reader: {
            type: 'json'
        }
    }
});