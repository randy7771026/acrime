var i;
var coords = [29.801902, -95.365821];
var ocoords = [29.801902, -95.365821];
var ncoords = [29.801902, -95.365821];
var scoords = [29.801902, -95.365821];
var events = [];
var mintime = 0;
var maxtime = 0;
var burglaries = new L.LayerGroup();
var robberies = new L.LayerGroup();
var aggravated_assaults = new L.LayerGroup();
var thefts = new L.LayerGroup();
var auto_thefts = new L.LayerGroup();
var rapes = new L.LayerGroup();
var murders = new L.LayerGroup();
var burglaryLayerGroup = false;
var layerControl = false;
var bluestring = ` `;

    

 // create popup contents
    var customPopup = "Mozilla Toronto Offices<br/><img src='http://joshuafrazier.info/images/maptime.gif' alt='maptime logo gif' width='350px'/>";
    
    // specify popup options 
    var customOptions =
        {
        'maxWidth': '500',
        'className' : 'custom'
        }
    

var mymap = L.map('mapid',{
			    layers: [thefts] // only add one!
		    }).setView(coords, 13);
   var overlays = {
			"Thefts": thefts
		};
var Robbery = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Theft = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Burglary = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Rape = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Aggravated_Assault = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Auto_Theft = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var Murder = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var greyIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var OpenStreetMap_Mapnik = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'

}).addTo(mymap);

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [" Theft"," Robbery"," Burglary"," Auto_Theft"," Aggravated_Assault"," Murder"," Rape"],
        labels = ['https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
                  'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png'];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
             (" <img src="+ labels[i] +" >") + grades[i] +'<br>';
    }

    return div;
};

legend.addTo(mymap);



function make(test){

 for(i = 0; i < events.length; i++){
 	if ( events[i].attributes.Time_Begun > test ){
 	if ( events[i].attributes.Time_Begun < mintime ){
      mintime = events[i].attributes.Time_Begun; 	
 	};
 	
 	if ( events[i].attributes.Time_Begun > maxtime ){
      maxtime = events[i].attributes.Time_Begun; 	
 	};
 	var time = moment(events[i].attributes.Time_Begun).format("MMM Do YY h:mm:ss a");
 //   console.log("unix", events[i].attributes.Time_Begun, "time", time);
 	if ( events[i].attributes.Premise_Type != "Residence or House" &&
 	     events[i].attributes.Premise_Type != "Driveway" &&
        events[i].attributes.Premise_Type != "Road, Street, or Sidewalk" 	
 	 ) {
 	if ( events[i].attributes.SNB_No == 51 ||
 	     events[i].attributes.SNB_No == 45 ||
 	     events[i].attributes.SNB_No == 13 ||
 	     events[i].attributes.SNB_No == 15 ||
 	     events[i].attributes.SNB_No == 48 ||
 	     events[i].attributes.SNB_No == 51 ||
 	     events[i].attributes.SNB_No == 12 ||
 	     events[i].attributes.SNB_No == 46 
 	 )
    	 
 	{
   
     
     var point = new L.Point(events[i].geometry.x, events[i].geometry.y);
  
     var latlng = L.Projection.SphericalMercator.unproject(point);  
     
     // create popup contents
     customPopup =  events[i].attributes.Offense + "<br/>" +
                    events[i].attributes.Premise_Type + "<br/>" +
                    events[i].attributes.Address_Range + "<br/>" +
                    time;
     
     if ( events[i].attributes.Offense == "Theft" )
      { 
       new L.Marker([latlng.lat, latlng.lng], {icon: Theft},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(thefts);
      }
     
      else if ( events[i].attributes.Offense == "Burglary" )
       { 
        new L.Marker([latlng.lat, latlng.lng], {icon: Burglary},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(burglaries);
       }
      
       
        else if( events[i].attributes.Offense == "Robbery" )
        { 
         new L.Marker([latlng.lat, latlng.lng], {icon: Robbery},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(robberies);
        }
        
          else if( events[i].attributes.Offense == "Aggravated Assault" )
          { 
           new L.Marker([latlng.lat, latlng.lng], {icon: Aggravated_Assault},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(aggravated_assaults);
          }
          
            else if( events[i].attributes.Offense == "Auto Theft" )
            { 
             new L.Marker([latlng.lat, latlng.lng], {icon: Auto_Theft},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(auto_thefts);
            }
            
               else if( events[i].attributes.Offense == "Murder" )
               { 
                new L.Marker([latlng.lat, latlng.lng], {icon: Murder},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(murders);
               }
               
                  else if( events[i].attributes.Offense == "Rape" )
                  { 
                   new L.Marker([latlng.lat, latlng.lng], {icon: Rape},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(rapes);
                  }
        
        else 
        {
         new L.Marker([latlng.lat, latlng.lng], {icon: greyIcon},{bounceOnAdd: true}).bindPopup(customPopup,customOptions).addTo(mymap);
        }
     
     
    }
    } 
    
    };
 };
 }
 
 var events = s1; //   first 30

 mintime = events[0].attributes.Time_Begun;
 maxtime = events[0].attributes.Time_Begun;

  make(0);
/*
  var events = data; //   second 30
 
  make(maxtime);
 
  var events = datal; //   third 30
 
  make(maxtime);
  
  var events = dataoct; //   October 23rd 30
 
  make(maxtime);
  
  var events = datanov; //   November 22nd 30
 
  make(maxtime);
*/

    console.log("i", i );
    console.log("mintime", mintime, "maxtime", maxtime);
    var ntime = moment(mintime).format("MMM Do YY h:mm:ss a");
    var xtime = moment(maxtime).format("MMM Do YY h:mm:ss a");
    console.log("ntime", ntime, "xtime", xtime);
 
    if(burglaryLayerGroup === false) {
    	   	
    }
      
    if(layerControl === false) {
        layerControl = L.control.layers().addTo(mymap);
    }
    
 //   layerControl.addOverlay(burglaryLayerGroup, "Burglaries").addTo(mymap);
        
      layerControl.addOverlay(thefts, "Thefts").addTo(mymap);      
      layerControl.addOverlay(robberies, "Robberies").addTo(mymap);  
      layerControl.addOverlay(burglaries, "Burglaries").addTo(mymap);  
      layerControl.addOverlay(aggravated_assaults, "Aggravated Assaults").addTo(mymap);  
      layerControl.addOverlay(auto_thefts, "Auto Thefts").addTo(mymap);  
      layerControl.addOverlay(rapes, "Rapes").addTo(mymap);  
      layerControl.addOverlay(murders, "Murders").addTo(mymap);  
        
         
 //   return false;
