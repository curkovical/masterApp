Ext.define('masterApp.view.map.MapController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.map',

    listen: {
        controller: {
            'main': {
                'locationEntered': 'onLocationEntered',
                'swapMarkers': 'onSwapMarkers',
                'vtypeChanged': 'onVtypeChanged'
            }
        }
    },

    onVtypeChanged: function(){        
        this.getRoute();
    },

    onLocationEntered: function(obj){        
        this.addMarker(obj);
    },

    onSwapMarkers: function(){
        vm = this.getViewModel();
        let start = vm.get('start');
        let end = vm.get('end');
        this.removeMarker({
            data: { marker: start }
        });
        this.removeMarker({
            data: { marker: end }
        });        
        this.addMarker({
            data: {
                kind: 'start'
            },
            coordinate: end.getGeometry().getCoordinates()
        });
        this.addMarker({
            data: {
                kind: 'end'
            },
            coordinate: start.getGeometry().getCoordinates()
        })
    },
    
    init: function() {
        this.initializeMap();
    },

    initializeMap: function() {
        var controller = this;
        var vm = this.getViewModel();

        //EPSG:3857
        var mapView = new ol.View({
            center: ol.proj.fromLonLat([-92.411, 30.924]),
            zoom: 7
        });

        var map = new ol.Map({
            interactions: ol.interaction.defaults({
                shiftDragZoom: false
            }),
            layers: controller.createLayers(),
            view: mapView,            
            controls: [
                new ol.control.Zoom(),
                new ol.control.Rotate()
            ]
        });
        map.addControl(this.createContextMenu(map));

        this.getView().setMap(map);
        vm.set('map', map);
        this.addMapInteractions(map);
    },

    addMapInteractions: function(map){
        var vm = this.getViewModel();
        var controller = this;

        let selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
            toggleCondition: ol.events.condition.platformModifierKeyOnly
        });        
        map.addInteraction(selectInteraction);
        selectInteraction.on('select', function(selection){
            vm.set('routeSelected', null);
            vm.set('bridgeSelected', null);
            let selected = selection.selected[0];
            if (selected != null) {
                if (selected.get('type') == 'route'){
                    var routeFeatures = selected.get('routeFeatures');
                    selectInteraction.getFeatures().clear();
                    for (let j=0; j < routeFeatures.length; j++){
                        selectInteraction.getFeatures().push(routeFeatures[j]);
                    }
                    let sourceObj = {}
                    if (routeFeatures.length > 0)
                        sourceObj['max weight'] = selected.get('maxWeight') + ' t';
                    sourceObj.distance = selected.get('distance');
                    sourceObj.duration = selected.get('duration');
                    vm.set('routeSelected', sourceObj);

                    if (selected.get('isMain') == false) {
                        let routes = vm.get('navigResLayer').getSource().getFeatures();
                        for (var i = 0; i < routes.length; i++) {
                            if (routes[i].get('isMain') == true) {
                                routes[i].set('isMain', false);
                                routes[i].setStyle(new ol.style.Style({
                                    stroke: new ol.style.Stroke({
                                        color: 'rgba(47,79,79, 0.4)',
                                        width: 5
                                    })
                                }));
                                break;
                            }
                        }
                        selected.set('isMain', true);
                        selected.setStyle(new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: 'rgba(0, 255, 0, 0.6)',
                                width: 5
                            })
                        }));
                    }
                }
                else if (selection.selected.length == 1 && selection.selected[0].get('BASE_LIFE') != null) { // bridge selected
                    if (vm.get('bridgeGridShown') == null) { // to avoid autoShow bug
                        Ext.getCmp('bridgegrid').show();
                        vm.set('bridgeGridShown', true);
                    }                    
                    vm.set('bridgeSelected', selected.getProperties())
                }
            }
        });
        vm.set('selectInteraction', selectInteraction)

        var translateInteraction = new ol.interaction.Translate({
            layers: [vm.get('markerLayer')]
        });

        translateInteraction.on('translateend', function(evt) {            
            if(vm.get('start') && vm.get('end'))
                controller.getRoute();
        });
        map.addInteraction(translateInteraction);
    },

    createLayers: function() {
        var me = this;
        var vm = me.getViewModel();
        var layers = [];

        var backgroundLayer = this.createBackgroundLayers();
        layers = layers.concat(backgroundLayer);
        
        layers.push(this.createFeatureLayer());
        layers.push(this.createNavigResLayer());
        layers.push(this.createMarkerLayer());        

        return layers;
    },

    createBackgroundLayers: function() {        
        var openStreetMapLayer = new ol.layer.Tile({
            source: new ol.source.OSM(),
            legendConfig: {
                isBackgroundLayer: true,
                label: 'Open Street Map',
            }
        });
        return [openStreetMapLayer];
    },

    createMarkerLayer: function() {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector()                        
        });
        this.getViewModel().set('markerLayer', vectorLayer);
        return vectorLayer;
    },

    createFeatureLayer: function(){
        return new ol.layer.Vector({
            source: new ol.source.Vector({                
                url: 'resources/postedBridges.geojson',
                format: new ol.format.GeoJSON()
            }),
            style: new ol.style.Style({
                image: new ol.style.Circle( /** @type {olx.style.IconOptions} */ ({
                    radius: 4,
                    fill: new ol.style.Fill({
                        color: '#3383BE'
                    }),
                    stroke: new ol.style.Stroke({                        
                        width: 1
                    })
                }))
            }),
            name: 'featureLayer'
        });        
    },

    createNavigResLayer: function() {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector()            
        });
        this.getViewModel().set('navigResLayer', vectorLayer);
        return vectorLayer;
    },
    
    createContextMenu: function(map){
        var controller = this;
        var vm = this.getViewModel();

        controller.addMarker = function(obj){            
            var iconSrc = 'resources/icons/';            
            iconSrc += obj.data.kind == 'start' ? 'startPin.png' : 'endPin.png';
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    src: iconSrc,
                    anchor: [0.5, 0.96]
                })
            });
            var feature = new ol.Feature({
                type: 'removable',
                geometry: new ol.geom.Point(obj.coordinate),
                kind: obj.data.kind
            });
            feature.setStyle(iconStyle);

            var existingPin = vm.get(obj.data.kind);
            if (existingPin)
                vm.get('markerLayer').getSource().removeFeature(existingPin);            

            vm.get('markerLayer').getSource().addFeature(feature);
            vm.set(obj.data.kind, feature);            
            controller.fireEvent('markerAdded', obj);

            if(vm.get('start') && vm.get('end'))
                controller.getRoute();                

            return feature;
        }
        var contextmenu = new ContextMenu({
            width: 170,
            defaultItems: false, // defaultItems are (for now) Zoom In/Zoom Out            
        });

        var contextmenuItems = [{
            text: 'Set start',
            data: {
                kind: 'start'
            },
            icon: 'resources/icons/markerGreen.png',  // this can be relative or absolute
            callback: controller.addMarker
        },
        {
            text: 'Set destination',
            data: {
                kind: 'end'
            },                
            icon: 'resources/icons/markerRed.png',  // this can be relative or absolute
            callback: controller.addMarker
        }];

        controller.removeMarker = function(obj){            
            var layerSource = vm.get('markerLayer').getSource();
            layerSource.removeFeature(obj.data.marker);
            layerSource.refresh();
            vm.set('routeSelected', null);
            var markerKind = obj.data.marker.get('kind');            
            vm.set(markerKind, null);
            vm.get('navigResLayer').getSource().clear();
            vm.get('selectInteraction').getFeatures().clear();
            controller.fireEvent('markerRemoved', markerKind);
        };

        var removeMarkerItem = {
            text: 'Remove this Marker',
            //classname: 'marker',
            icon: 'resources/icons/removePin.png',
            callback: controller.removeMarker
        };

        var contextmenu = new ContextMenu({
            width: 170,
            defaultItems: false
        });

        contextmenu.on('open', function(evt) {
            var feature = map.forEachFeatureAtPixel(evt.pixel, function(ft, l) {
                return ft;
            });
            contextmenu.clear();
            if (feature && feature.get('type') === 'removable') {                
                removeMarkerItem.data = {
                    marker: feature
                };
                contextmenu.push(removeMarkerItem);
            } else {                
                contextmenu.extend(contextmenuItems);                
                //contextmenu.extend(contextmenu.getDefaultItems());
            }
        });
        return contextmenu;
    },

    getRoute: function() {
        var vm = this.getViewModel();
        var start = vm.get('start');
        var end = vm.get('end');
        var controller = this;
        var selectInteraction = vm.get('selectInteraction');

        if (start && end) {
            // var features = vm.get('markerLayer').getSource().getFeatures();            
            selectInteraction.getFeatures().clear();
            vm.set('bridgeSelected', null);
            vm.set('routeSelected', null);
            var markerCoords = [];
            markerCoords.unshift(ol.proj.transform(start.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'));
            markerCoords.push(ol.proj.transform(end.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326'));
            var parser = new jsts.io.OL3Parser();
            var layers = controller.getView().getLayers().getArray();
            var features
            for (var i = 0; i < layers.length; i++)
                if (layers[i].text == 'featureLayer') {
                    features = layers[i].getSource().getFeatures();
                    break;
                }
            var navigResLayer = vm.get('navigResLayer').getSource();                    
            navigResLayer.clear();
            //layerSource.refresh();
            var vWeight = vm.get('vehicleWeight');
            var vType = vm.get('vehicleType');
            var loadIndex = vType == 'combined' ? 1 : 0;
            masterApp.service.MapService.getRoute(markerCoords, function(result) {
                var validCount = 0;
                var isMainSet = false;
                for (var i = 0; i < result.routes.length; i++) {
                    var routeValid = true                    
                    var route = (new ol.format.GeoJSON()).readFeature(result.routes[i].geometry, {
                        dataProjection: 'EPSG:4326',
                        featureProjection: 'EPSG:3857',
                    });
                    route.set('maxWeight', 1000);
                    route.set('distance', (result.routes[i].distance / 1000).toFixed(2).toString() + ' km');
                    let duration = result.routes[i].duration;
                    let h = Math.floor(duration / 3600);
                    let m = ((duration - h * 3600) / 60).toFixed(0);
                    let hString = h > 0 ? h.toString() + 'h ' : '';
                    route.set('duration', hString + m.toString() + 'm');                    
                    route.set('type', 'route');
                    
                    var jstsGeom = parser.read(route.getGeometry());
                    var buffered = jstsGeom.buffer(20);
                    var routeBuffer = new ol.Feature({
                        geometry: parser.write(buffered)
                    });
                    routeBuffer.setGeometry(parser.write(buffered));
                    var routeFeatures = [];

                    features.forEach(function(feature){
                        let geometry = feature.getGeometry()
                        if (geometry != null && routeBuffer.getGeometry().intersectsCoordinate(geometry.getCoordinates())) {                                                        
                            routeFeatures.push(feature);
                        }
                    });
                    route.set('routeFeatures', routeFeatures);
                    
                    // determining whether found route is valid
                    if (vWeight == null) vWeight = 0;
                    for (let j=0; j < routeFeatures.length; j++){
                        let loadLimit = routeFeatures[j].get('POST_LOAD_LIMIT');
                        let bridgeLoads = loadLimit.split('-');
                        if (loadLimit == 'CL---' || // bridge is closed
                            vWeight > parseInt(bridgeLoads[loadIndex])) {
                            routeValid = false;
                            break;
                        }                        
                        if (route.get('maxWeight') > bridgeLoads[loadIndex])
                            route.set('maxWeight', bridgeLoads[loadIndex]);                        
                    }
                    if (routeValid == true) {
                        let isMainRoute = false;
                        if (isMainSet == false){
                            isMainRoute = true;
                            isMainSet = true;
                        }
                        route.set('isMain', isMainRoute);
                        var color = (isMainRoute == true ? 'rgba(0, 255, 0, 0.6)' : 'rgba(47,79,79, 0.4)');
                        route.setStyle(new ol.style.Style({
                            stroke: new ol.style.Stroke({
                                color: color,
                                width: 5
                            })
                        }));
                        navigResLayer.addFeature(route);
                        
                        if (isMainRoute == true) {
                            for (let j=0; j < routeFeatures.length; j++)
                                selectInteraction.getFeatures().push(routeFeatures[j]);
                            let sourceObj = {}
                            if (routeFeatures.length > 0)
                                sourceObj['max weight'] = route.get('maxWeight') + ' t';
                            sourceObj.distance = route.get('distance');
                            sourceObj.duration = route.get('duration');
                            vm.set('routeSelected', sourceObj);
                            if (vm.get('routeGridShown') == null){ // to avoid autoShow bug
                                Ext.getCmp('routegrid').show();
                                vm.set('routeGridShown', true);
                            }
                        }
                        validCount++
                    }
                }
                if (validCount == 0) {
                    selectInteraction.getFeatures().clear();
                    Ext.Msg.show({
                        title: 'Status',
                        message: 'No routes were found.',
                        icon: Ext.Msg.ERROR,
                        buttons: Ext.Msg.OK
                    });                    
                }                
            });
        }
    }
});