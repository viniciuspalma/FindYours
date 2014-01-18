

$(function() {
    var 
        _map = null,
        _seconds = 30,
        _llbounds = null,
        myLatLng, 
        oldLatLng = "",
	    boolTripTrack=true;  

    function drawMap(){
        var latlng = new google.maps.LatLng(currentLatitude,currentLongitude);
        myLatLng = latlng;
        var mapOptions = {
            center: latlng,
            zoom:7,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            disableDefaultUI: true,
        };

        if (boolTripTrack===true)
        {
            _map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        }
    }

    var
    rowIn   = $( ".row-in" ),
    inicio  = $( "#inicio" ),
    mapDiv  = $( "#map_canvas" ),
    btnMenu = $( "#btn-menu" ),
    writeDiv= $( "#write" ),
    mpwrDiv = $( "#map-write" ),
    currentLatitude = "-29,41762",
    currentLongitude = "-51,14057",
    options = {
        timeout: 15000,
        maximumAge: 11000,
        enableHighAccuracy: true
    },
    initialize=function(){
        rowIn.remove();
        inicio.css( "height", $( window ).height() );
        inicio.show( "slow" );
    },
    initializeMap=function(){
        inicio.remove();
        writeDiv.css( "height", $( window ).height() );
        mapDiv.css( "height", $( window ).height() );
        mpwrDiv.css( "height", $( window ).height() );
        mpwrDiv.show();
        userDataVideo();
        
    },
    userDataVideo=function(){        
        navigator.getUserMedia('video, audio', function(localMediaStream) {
            var video = document.querySelector('video');
            video.src = window.URL.createObjectURL(localMediaStream);
        });
    },    
    getLocation = function(){
        console.log("in getLocation",4);
    },
    fail = function(){
		console.log("Geolocation failed. \nPlease enable GPS in Settings.",1);
	},
    suc = function(p){
		console.log("geolocation success",4);
		if( _map === null ) {
			currentLatitude = p.coords.latitude;
			currentLongitude = p.coords.longitude;
			drawMap();
		}
        else {
            myLatLng = new google.maps.LatLng(p.coords.latitude, p.coords.longitude);
        }
        
        if((myLatLng.toString().localeCompare(oldLatLng.toString())) != 0){
            var Marker = new google.maps.Marker({
              position: myLatLng,
              map: _map
            });
            
            if( _llbounds === null ){
                _llbounds = new google.maps.LatLngBounds(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));//original
            }
            else{
                _llbounds.extend(myLatLng);
            }
            
            _map.fitBounds(_llbounds);
        }
        oldLatLng = myLatLng;
	},
    onDeviceReady=function(){
        try
        {
			if (intel.xdk.geolocation !== null){
				document.getElementById("map_canvas").style.height = screen.height + "px";
				intel.xdk.geolocation.watchPosition(suc,fail,options);
			}
        }
        catch(e){
            alert(e.message);
        }
		
		try{
			//hide splash screen
			intel.xdk.device.hideSplashScreen();
            setTimeout(initialize, 5000);
            
        }
        catch(e) {}
    };    
    
    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);
    document.querySelector( '.btn-write' ).addEventListener ( "click", initializeMap );
    
    
    $(document).foundation();
});