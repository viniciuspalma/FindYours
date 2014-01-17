

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
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
        };

        if (boolTripTrack==true)
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
        timeout: 1000,
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
        mpwrDiv.show( "slow" );
    },
    getLocation = function(){
        console.log("in getLocation",4);
    },
    fail = function(){
		console.log("Geolocation failed. \nPlease enable GPS in Settings.",1);
	},
    suc = function(p){
		console.log("geolocation success",4);
		if( _map == null ) {
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
            
            if( _llbounds == null ){
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
            if (intel.xdk.device.platform.indexOf("Android")!=-1)
            {
                intel.xdk.display.useViewport(480,480);
                document.getElementById("map_canvas").style.width="480px";
            }
            else if (intel.xdk.device.platform.indexOf("iOS")!=-1)
            {
                if (intel.xdk.device.model.indexOf("iPhone")!=-1 || intel.xdk.device.model.indexOf("iPod")!=-1)
                {
                    intel.xdk.display.useViewport(320,320);
                    document.getElementById("map_canvas").style.width="320px";
                }
                else if (intel.xdk.device.model.indexOf("iPad")!=-1)
                {
                    intel.xdk.display.useViewport(768,768);
                    document.getElementById("map_canvas").style.width="768px";
                }
            }
            
           if (intel.xdk.iswin8) {
                document.getElementById("map_canvas").style.width = screen.width + "px"
                document.getElementById("map_canvas").style.height = screen.height + "px";
            }

            
			if (intel.xdk.geolocation != null)
			{
				document.getElementById("map_canvas").style.height = screen.height + "px";
				intel.xdk.geolocation.watchPosition(suc,fail,options);
			}
        }
        catch(e)
        {
            alert(e.message);
        }

        try
        {
            //lock orientation
            intel.xdk.device.setRotateOrientation("portrait");
            intel.xdk.device.setAutoRotate(false);
        }
        catch(e) {}

        try
        {
            //manage power
            intel.xdk.device.managePower(true,false);
        }
        catch(e) {}
		
		try
		{
			//hide splash screen
			intel.xdk.device.hideSplashScreen();
            setTimeout(initialize, 5000);
        }
        catch(e) {}
    };    
    
    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);
    document.querySelector( '.btn-write' ).addEventListener("click", initializeMap);
    $(document).foundation();
});