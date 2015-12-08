(function() {
    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 10, lng: 121},
            zoom: 5
        });
    }

    window.MyApp = {
        init: function() {
            initMap();
        }
    };
})();