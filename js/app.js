(function($, ko) {
    var model = {
        locations: [
            {
                name: 'Burnham Park Baguio, Philippines',
                lat : 16.4095362,
                lng : 120.5948181,
                wikiQuery: 'Burnham Park Philippines'
            }, {
                name: 'Makati, Philippines',
                lat: 14.5545196,
                lng: 120.9980553,
                wikiQuery: 'Makati'
            }, {
                name: 'Boracay, Philippines',
                lat: 11.969281,
                lng: 121.8922095,
                wikiQuery: 'Boracay'
            }, {
                name: 'Puerto Princesa, Philippines',
                lat: 10.1925648,
                lng: 118.8915586,
                wikiQuery: 'Puerto Princesa Subterranean River National Park'
            }, {
                name: 'Marina Bay Sands, Singapore',
                lat : 1.2838839,
                lng : 103.8567958,
                wikiQuery: 'Marina Bay Sands'
            }, {
                name: 'Mactan, Cebu, Philippines',
                lat : 10.2880615,
                lng : 123.9139672,
                wikiQuery: 'Mactan'
            }, {
                name: 'Petronas Twin Towers, Malaysia',
                lat: 3.1579054,
                lng: 101.7094059,
                wikiQuery: 'Petronas Towers'
            }, {
                name: 'Angkor Wat, Cambodia',
                lat: 13.4124693,
                lng: 103.864797,
                wikiQuery: 'Angkor Wat'
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
        getWiki: function(marker) {
            if (marker.content) {
                return $.Deferred().resolve(marker.content);
            }

            return $.ajax({
                url: 'https://en.wikipedia.org/w/api.php',
                type: 'GET',
                dataType: 'jsonp',
                data: {
                    action : 'query',
                    list : 'search',
                    srwhat : 'text',
                    format : 'json',
                    srsearch: marker.wikiQuery
                }
            });
        }
    };

    var mapView = {
        init: function() {
            this.initSidebar();
            this.renderMap();
            this.renderMarkers();
            var viewModel = new LocationsViewModel();
            ko.applyBindings(viewModel);
            viewModel.updateLocations('');
        },
        initSidebar: function() {
            var self = this;
            var $menuLeft = $('.pushmenu-left');
            var $toggleBtn = $('#toggle-btn');
            $toggleBtn.click(function() {
                $(this).toggleClass('active');
                $('.pushmenu-push').toggleClass('pushmenu-open');
            }).one('click', function() {
                // Resize once when sidebar is hidden since map area will be wider
                self.resizeMap(100);
            });
        },
        renderMap: function() {
            var map = document.getElementById('map');
            controller.initMap(map);
        },
        renderMarkers: function() {
            var self = this;
            var locations = controller.getLocations();
            locations.forEach(function(loc) {
                self.addMarker(loc);
            });
        },
        addMarker: function(loc) {
            var self = this;
            var latlng = new google.maps.LatLng(loc.lat, loc.lng);
            loc.marker = new google.maps.Marker({
                position: latlng,
                title: loc.name,
                map: model.map,
                wikiQuery: loc.wikiQuery
            });

            loc.marker.addListener('click', function() {
                mapView.markerBounce(loc.marker);
                self.showInfoWindow(loc.marker);
            });
        },
        closeMarkers: function() {
            controller.getLocations().forEach(function(loc) {
                if (loc.marker && loc.marker.infoWindow) {
                    loc.marker.infoWindow.close();
                }
            });
        },
        createInfoWindow: function(marker, callback) {
            if (!marker.infoWindow) {
                controller.getWiki(marker).done(function(data) {
                    var item = null;
                    if (data && data.query && (item = data.query.search) && item.length > 0) {
                        item = item[0];
                        var url = 'https://en.wikipedia.org/wiki/' + item.title;
                        marker.content = [
                            '<div class="infowindow">',
                            '<h3><a href="@url" alt="@title" target="_blank">@title</a></h3>',
                            '<div class="content">',
                                item.snippet,
                                ' ... <a href="@url" alt="@title" target="_blank">read more</a>',
                            '</div>',
                            '</div>'
                        ].join('').replace(/@url/g, url).replace(/@title/g, item.title);
                    } else {
                        marker.content = '<div class="infowindow"><h3>' + marker.title + '</h3></div>';
                    }
                    marker.infoWindow = new google.maps.InfoWindow({
                        content: marker.content,
                        maxWidth: 400
                    });

                    if (typeof callback == 'function') {
                        callback(marker);
                    }
                });
            } else {
                if (typeof callback == 'function') {
                    callback(marker);
                }
            }
        },
        showInfoWindow: function(marker) {
            this.closeMarkers();
            this.createInfoWindow(marker, function() {
                marker.infoWindow.open(controller.getMap(), marker);
            });
        },
        markerBounce: function(marker) {
            marker.setAnimation(null);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            window.setTimeout(function() {
                marker.setAnimation(null);
            }, 2100);
        },
        resizeMap: function(interval) {
            window.setTimeout(function() {
                google.maps.event.trigger(controller.getMap(), 'resize');
            }, interval || 0);
        }
    };

    var LocationsViewModel = function() {
        var self = this;
        this.location = ko.observable("");
        this.locations = ko.observableArray();

        controller.getLocations().forEach(function(loc) {
            self.locations.push({
                name: ko.observable(loc.name),
                isVisible: ko.observable(true),
                marker: loc.marker
            });
        });

        this.updateLocations = function(val) {
            var bounds = new google.maps.LatLngBounds();
            var count = 0;
            self.locations().forEach(function(loc) {
                // Match only when a word in the location starts with value
                var match = loc.name().match(new RegExp('\\b' + val + '\\S*', 'i')) || [];
                var visible = match.length > 0;
                loc.isVisible(visible);
                loc.marker.setVisible(visible);
                if (visible) {
                    bounds.extend(loc.marker.getPosition());
                    ++count;
                }
            });
            var map = controller.getMap();
            map.fitBounds(bounds);
            if (count < 2) {
                map.setZoom(7);
            }
        };

        this.location.subscribe(function(val) {
            self.updateLocations(val);
        });

        this.onClick = function(loc) {
            mapView.markerBounce(loc.marker);
            mapView.showInfoWindow(loc.marker);
        };
    };

    window.MyApp = {
        init: function() {
            mapView.init();
        }
    };

})(jQuery, ko);