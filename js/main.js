

$(function() {
    var
    rowIn = $( ".row-in" ),
    inicio = $( "#inicio" ),
        
    initialize=function(){
        rowIn.remove();
        inicio.css( "height", $( window ).height() );
        inicio.show( "slow" );
    },
    onDeviceReady=function(){	
        intel.xdk.device.hideSplashScreen();
        setTimeout(initialize, 5000);
    };
    
    
    document.addEventListener("intel.xdk.device.ready",onDeviceReady,false);
    
    $(document).foundation();
});
