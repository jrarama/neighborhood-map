(function() {
    var model = {
        locations: [
            {
                name: 'Burnham Park Baguio, Philippines',
                lat : 16.4095362,
                lng : 120.5948181
            }, {
                name: 'Merlion Park, Singapore',
                lat : 1.2866432,
                lng : 103.8543444
            }, {
                name: 'Batam City, Indonesia',
                lat : 1.0456264,
                lng : 104.0304535
            }, {
                name: 'La Union, Philippines',
                lat: 16.590225,
                lng: 120.2994233
            }, {
                name: 'Ayala Triangle Walkways, Makati, Philippines',
                lat : 14.5568405,
                lng : 121.0238122
            }
        ],
        map: null,
        markers: {}
    };

    var controller = {
        getMap: function() {
            return model.map;
        },
        getMarkers: function() {
            return model.markers;
        },
        getLocations: function() {
            return model.locations;
        },
        initMap: function(elem) {
            model.map = new google.maps.Map(elem, {
                center: {lat: 10, lng: 121},
                zoom: 5
            });
        },
        addMarker: function(loc) {
            var latlng = new google.maps.LatLng(loc.lat, loc.lng);
            model.markers[loc.name] = new google.maps.Marker({
                position: latlng,
                title: loc.name,
                map: model.map
            });
        }
    };

    var mapView = {
        init: function() {
            this.renderMap();
            this.renderMarkers();
        },
        renderMap: function() {
            var map = document.getElementById('map');
            controller.initMap(map);
        },
        renderMarkers: function() {
            var locations = controller.getLocations();
            locations.forEach(function(loc) {
                controller.addMarker(loc);
            });
        }
    };

    window.MyApp = {
        init: function() {
            mapView.init();
        }
    };

    $(function() {
        var $menuLeft = $('.pushmenu-left');
        var $navList = $('#navlist');

        $navList.click(function() {
            $(this).toggleClass('active');
            $('.pushmenu-push').toggleClass('pushmenu-push-toright');
            $menuLeft.toggleClass('pushmenu-open');
        });
    });
})();