    var WPmap = {

        // HTML Elements we'll use later!
        mapContainer   : document.getElementById('map-container'),
        dirContainer   : document.getElementById('dir-container'),
        toInput        : document.getElementById('map-config-address'),
        fromInput      : document.getElementById('from-input'),
        unitInput      : document.getElementById('unit-input'),
        startLatLng    : null,

        // Google Maps API Objects
        dirService     : new google.maps.DirectionsService(),
        dirRenderer    : new google.maps.DirectionsRenderer(),
        map:null,

        showDirections:function (dirResult, dirStatus) {
            if (dirStatus != google.maps.DirectionsStatus.OK) {
                alert('Directions failed: ' + dirStatus);
                return;
            }
            // Show directions
            WPmap.dirRenderer.setMap(WPmap.map);
            WPmap.dirRenderer.setPanel(WPmap.dirContainer);
            WPmap.dirRenderer.setDirections(dirResult);
        },

        getStartLatLng:function () {
            var n = WPmap.toInput.value.split(",");
            WPmap.startLatLng = new google.maps.LatLng(n[0], n[1]);
        },

        getSelectedUnitSystem:function () {
            return WPmap.unitInput.options[WPmap.unitInput.selectedIndex].value == 'metric' ?
                google.maps.DirectionsUnitSystem.METRIC :
                google.maps.DirectionsUnitSystem.IMPERIAL;
        },

        getDirections:function () {

            var fromStr = WPmap.fromInput.value; //Get the postcode that was entered

            var dirRequest = {
                origin      : fromStr,
                destination : WPmap.startLatLng,
                travelMode  : google.maps.DirectionsTravelMode.DRIVING,
                unitSystem  : WPmap.getSelectedUnitSystem()
            };

            WPmap.dirService.route(dirRequest, WPmap.showDirections);
        },

        init:function () {

            //get the content
            var infoWindowContent = WPmap.mapContainer.getAttribute('data-map-infowindow');
            var initialZoom       = WPmap.mapContainer.getAttribute('data-map-zoom');

            WPmap.getStartLatLng();

            //setup the map.
            WPmap.map = new google.maps.Map(WPmap.mapContainer, {
                zoom:parseInt(initialZoom),     //ensure it comes through as an Integer
                center:WPmap.startLatLng,
                mapTypeId:google.maps.MapTypeId.ROADMAP
            });

            //setup the red pin marker
            marker = new google.maps.Marker({
                map:WPmap.map,
                position:WPmap.startLatLng,
                draggable:false
            });

            //set the infowindow content
            infoWindow = new google.maps.InfoWindow({
                content:infoWindowContent
            });
            infoWindow.open(WPmap.map, marker);

            //listen for when Directions are requested
            google.maps.event.addListener(WPmap.dirRenderer, 'directions_changed', function () {

                infoWindow.close();         //close the first infoWindow
                marker.setVisible(false);   //remove the first marker

                //setup strings to be used.
                var distanceString = WPmap.dirRenderer.directions.routes[0].legs[0].distance.text;

                //set the content of the infoWindow before we open it again.
                infoWindow.setContent('Thanks!<br /> It looks like you\'re about <strong> ' + distanceString + '</strong> away from us. <br />Directions are just below the map');

                //re-open the infoWindow
                infoWindow.open(WPmap.map, marker);
                setTimeout(function () {
                    infoWindow.close()
                }, 8000); //close it after 8 seconds.

            });
        }//init
    };

    google.maps.event.addDomListener(window, 'load', WPmap.init);