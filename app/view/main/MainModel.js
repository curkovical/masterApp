/**
 * This class is the view model for the Main view of the application.
 */
Ext.define('masterApp.view.main.MainModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main',
    data: {
        name: 'masterApp',
        startCmb: {
            data: {
                name: 'start'
            }            
        },
        endCmb: {
            data: {
                name: 'end'
            }
        },
        vehicleType: 'single',
        swapDisabled: true,
    },
    stores: {        
        startCmbStore: {
            type: 'comboStore'
        },
        endCmbStore: {
            type: 'comboStore'
        }
    },
    formulas: {
        swapDisabled: function(get){
            if (get('startCmb.value') == '' || get('endCmb.value') == '')
                return true;
            return false;
        }
    }
    //TODO - add data, formulas and/or methods to support your view    
});
