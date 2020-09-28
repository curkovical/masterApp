/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('masterApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    listen: {
        controller: {
            'map': {
                'markerAdded': 'onMarkerAdded',
                'markerRemoved': 'onMarkerRemoved'                
            }
        }        
    },

    vtypeChanged: function(){
        this.fireEvent('vtypeChanged');
    },

    onMarkerRemoved: function(markerKind){
        let vm = this.getViewModel();
        vm.set(markerKind + 'Cmb.value', "");
    },

    locationEntered: function(combo, e){
        controller = this;        
        // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
        // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN        
        if (e.getKey() == e.ENTER) {
            let rawValue = combo.getRawValue().trim();
            rawValue = rawValue.replace(/ +/g, '+');
            var query = 'https://nominatim.openstreetmap.org/search?q=' + rawValue + '&format=json';
            var store = combo.getStore();            
            store.getProxy().setUrl(query);
            store.load({
                callback: function(data){                    
                    combo.expand();
                }
            });
        }
    },

    pinComboRecordSelected: function(cmb, record){
        let obj = {
            data: {
                kind: cmb.getName()
            },
            coordinate: []
        };
        let data = record.getData();
        console.log(record)
        obj.coordinate = [parseFloat(data.lon), parseFloat(data.lat)];
        obj.coordinate = ol.proj.fromLonLat(obj.coordinate);
        this.getViewModel().set(cmb.getName() + 'Cmb.coordinate', obj.coordinate)
        this.fireEvent('locationEntered', obj);
    },

    onMarkerAdded: function(obj){
        vm = this.getViewModel();
        vm.getStore(obj.data.kind + 'CmbStore').removeAll();
        vm.set(obj.data.kind + 'Cmb.coordinate', obj.coordinate);
        masterApp.service.MainService.getAdrFromLatLon(obj.coordinate, function(data){             
            vm.set(obj.data.kind + 'Cmb.value', data)
        });
    },

    swapMarkers: function(){
        let vm = this.getViewModel();
        if (vm.get('startCmb.value') && vm.get('endCmb.value')) {
            this.fireEvent('swapMarkers');
        }
    }
    
});
