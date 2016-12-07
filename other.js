(function(window){

var TOTAL_LAPSED_TIME = 60 * 1000;

// time related helper functions
var time = 'attributes.Time_Begun';
var getEventTime = _.property(time);
var getStartTime = _.flow(_.first, getEventTime);
var getEndTime = _.flow(_.last, getEventTime);
var scaleToActualTime = function(lapsedTimeTotal, actualTimeTotal, lapsedTime){
  return (actualTimeTotal / lapsedTimeTotal) * lapsedTime;
}

// event related helper functions
var getIndicesForTimeSpan = function(offsetsLookup, timespanStart, timespanEnd){
  var inRangeLookups = _.filter(offsetsLookup, function(offsetItem){
    return (timespanStart <= offsetItem.offset) && (offsetItem.offset < timespanEnd);
  });

  return _.map(inRangeLookups, 'eventIndex');
}

var getForTimeSpan = function(offsetsLookup, items, timespanStart, timespanEnd){
  return _.at(items, getIndicesForTimeSpan(offsetsLookup, timespanStart, timespanEnd));
}

// // map related helper functions
// function makeIconSimple(icon){
//   var newIcon = _.cloneDeep(icon);
//   newIcon.options = _.omit(icon.options, 'shadowUrl', 'shadowSize');
//   newIcon.options.className = 'event-to-animate';
//   return newIcon;
// }

// var OFFENSE_TO_ICON_MAP = {
//   "Theft": makeIconSimple(Theft),
//   "Burglary": makeIconSimple(Burglary),
//   "Robbery": makeIconSimple(Robbery),
//   "Aggravated Assault": makeIconSimple(Aggravated_Assault),
//   "Auto Theft": makeIconSimple(Auto_Theft),
//   "Murder": makeIconSimple(Murder),
//   "Rape": makeIconSimple(Rape)
// };

var OFFENSE_TO_ICON_MAP = {
  "Theft": new L.divIcon({className: 'event-theft event-to-animate'}),
  "Burglary": new L.divIcon({className: 'event-burglary event-to-animate'}),
  "Robbery": new L.divIcon({className: 'event-robbery event-to-animate'}),
  "Aggravated Assault": new L.divIcon({className: 'event-agravated-assault event-to-animate'}),
  "Auto Theft": new L.divIcon({className: 'event-auto-theft event-to-animate'}),
  "Murder": new L.divIcon({className: 'event-murder event-to-animate'}),
  "Rape": new L.divIcon({className: 'event-rape event-to-animate'})
};

var SIMPLE_GRAY_ICON = new L.divIcon({className: 'event-none event-to-animate'});

function markEvent(eventToMark, eventsMap){
  var point = new L.Point(eventToMark.geometry.x, eventToMark.geometry.y);
  var latlng = L.Projection.SphericalMercator.unproject(point);

  var iconForEvent = OFFENSE_TO_ICON_MAP[eventToMark.attributes.Offense] || SIMPLE_GRAY_ICON;
  var eventMarker = new L.Marker([latlng.lat, latlng.lng], {icon: iconForEvent}).addTo(eventsMap);
  eventMarker._icon.dataset.description = eventToMark.attributes.Offense + ' ~ ' +
    eventToMark.attributes.Premise_Type + ' ~ ' + eventToMark.attributes.Address_Range + ' ~ ' +
    moment(eventToMark.attributes.Time_Begun).format("MMM Do YY h:mm:ss a");

  return eventMarker._leaflet_id;
}

// simple marker functions
function showMarker(marker){
  marker._icon.classList.remove('event-to-animate');
}

function hideMarker(marker){
  marker._icon.classList.add('event-to-animate');
}

function fadeInMarker(marker){
  marker._icon.classList.add('happening');
}

function fadeOutMarker(marker){
  marker._icon.classList.add('leaving');
}

function animateMarker(marker){
 // fadeInMarker(marker);
  _.delay(function(){
    fadeInMarker(marker);
  }, 100);
  _.delay(function(){
    fadeOutMarker(marker);
  }, 2000);
}

// the one that runs everything.
function animateEvents(){

//  var allEvents = _(datab).concat(data, datal, dataoct).sortBy(time).value();
  
  var allEvents = _(s1).sortBy(time).value();  
  
  var startTime = getStartTime(allEvents);
  var endTime = getEndTime(allEvents);

  var allOffsetsFromStart = _.map(allEvents, function(crimeEvent, index){
    return {
      offset: getEventTime(crimeEvent) - startTime,
      eventIndex: index
    };
  });

  var getIndicesForFrame = _.partial(getIndicesForTimeSpan, allOffsetsFromStart);
  var getEventsForFrame = _.partial(getForTimeSpan, allOffsetsFromStart, allEvents);
  var getEventsTime = _.partial(scaleToActualTime, TOTAL_LAPSED_TIME, endTime - startTime);

  function getFrameMarkers(markers, previous, progress){
    var indicesInFrame = getIndicesForFrame(getEventsTime(previous), getEventsTime(progress));
    var markersInFrame = _.at(markers, indicesInFrame);
    return _.at(mymap._layers, markersInFrame);
  }

  var start;
  var previous = 0;
  var previousMarkers = [];
  var animatedCrimes = new L.LayerGroup();

  mymap.removeLayer(thefts);
  mymap.addLayer(animatedCrimes);
  var eventMarkers = _.map(allEvents, _.partial(markEvent, _, animatedCrimes));
  var getEventMarkersForFrame = _.partial(getFrameMarkers, eventMarkers);

  var step = function(timestamp) {
    if (!start) start = timestamp;
    var progress = timestamp - start;

    var currentMarkers = getEventMarkersForFrame(previous, progress)
    _.forEach(currentMarkers, animateMarker);
    // _.forEach(previousMarkers, hideMarker);

    if (progress <= TOTAL_LAPSED_TIME) {
      window.requestAnimationFrame(step);
    }
    previous = progress;
    previousMarkers = currentMarkers;
  }

  window.requestAnimationFrame(step);
}

animateEvents();

})(window);

