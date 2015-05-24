var map;
var mapBounds = new OpenLayers.Bounds(748961,3808210, 2940563,  6836339);

if (typeof(lastUrl)=='undefined')  var lastUrl=document.URL;
window.onpopstate = function(event)  {
  if (document.URL != lastUrl) location.reload();
};


var mapMinZoom = 5;
var mapMaxZoom = 14;
var emptyTileURL = "http://www.maptiler.org/img/none.png";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function init(){
//  var containerWidth =900;
  var containerWidth= $("#main_page").width()-5;
  var nbpanels = 2;
  var padding = 5;

  window.onresize = function()
  {
    setTimeout( function() { map.updateSize();}, 1000);
  }
//  $(".panel").width( (containerWidth / nbpanels) - (nbpanels * padding - 2 * padding));

  $(".panel").resizable({
    handles: 'e',
    maxWidth: containerWidth-120,
    minWidth: 120,
    resize: function(event, ui){
      var currentWidth = ui.size.width;
      // set the content panel width
      $("#right_panel").css('margin-left', currentWidth+padding*2+'px' );
      $("#right_panel").width(containerWidth);

      $(this).width(currentWidth);
      $("#map_map").width(containerWidth - currentWidth -padding*2);
    }
  });

    Proj4js.defs["EPSG:2193"] = "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
    Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
    Proj4js.defs["EPSG:27200"] = "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +ellps=intl +datum=nzgd49 +units=m +no_defs";
    Proj4js.defs["ESPG:4326"] = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '


                  var options = {
                      maxResolution: 4891.969809375,
                      numZoomLevels: 11,
                      maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34),
                      div: "map_map",
                      controls: [],
                      projection: new OpenLayers.Projection("EPSG:2193"),
                      units: "m",
                      displayProjection: new OpenLayers.Projection("EPSG:2193"),
                  };
                  map = new OpenLayers.Map(options);

                  // Create Google Mercator layers

                   var nztm2009 = new OpenLayers.Layer.TMS("Topo50 2009", "http://tiles.mapspast.org.nz/topo50/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });
                   var nzms1999 = new OpenLayers.Layer.TMS("NZMS260 1999", "http://au.mapspast.org.nz/nzms260-1999/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });
                   var nzms1989 = new OpenLayers.Layer.TMS("NZMS1 1989", "http://au.mapspast.org.nz/nzms-1989/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });
                   var nzms1979 = new OpenLayers.Layer.TMS("NZMS1 1979", "http://au.mapspast.org.nz/nzms-1979/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });
                   var nzms1969 = new OpenLayers.Layer.TMS("NZMS1 1969", "http://tiles.mapspast.org.nz/nzms-1969/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });
                   var nzms1959 = new OpenLayers.Layer.TMS("NZMS1 1959", "http://au.mapspast.org.nz/nzms-1959/",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getURL
                  });

                  map.addLayers([ nztm2009, nzms1999, nzms1989, nzms1979, nzms1969, nzms1959]);

                  var switcherControl = new OpenLayers.Control.LayerSwitcher();
                  map.addControl(switcherControl);
                  switcherControl.maximizeControl();

                  map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
          
                  map.addControls([new OpenLayers.Control.PanZoomBar(),
                                   new OpenLayers.Control.Navigation(),
                                   new OpenLayers.Control.MousePosition(),
                                   new OpenLayers.Control.ArgParser(),
                                   new OpenLayers.Control.Attribution()]);
              }
          
              function getURL(bounds) {
                  bounds = this.adjustBounds(bounds);
                  var res = this.getServerResolution();
                  var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
                  var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
                  var z = this.getServerZoom()+5;
                  var path = this.serviceVersion + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type; 
                  var url = this.url;
                  if (OpenLayers.Util.isArray(url)) {
                      url = this.selectUrl(path, url);
                  }
                  if (mapBounds.intersectsBounds(bounds) && (z >= mapMinZoom) && (z <= mapMaxZoom)) {
                      return url + path;
                  } else {
                      return emptyTileURL;
                  }
              } 
          
           function getWindowHeight() {
                if (self.innerHeight) return self.innerHeight;
                    if (document.documentElement && document.documentElement.clientHeight)
                        return document.documentElement.clientHeight;
                    if (document.body) return document.body.clientHeight;
                        return 0;
                }

                function getWindowWidth() {
                    if (self.innerWidth) return self.innerWidth;
                    if (document.documentElement && document.documentElement.clientWidth)
                        return document.documentElement.clientWidth;
                    if (document.body) return document.body.clientWidth;
                        return 0;
                }

                function resize() {  
                    var map = document.getElementById("map");  
                    var header = document.getElementById("header");  
                    var subheader = document.getElementById("subheader");  
                    map.style.height = (getWindowHeight()-80) + "px";
                    map.style.width = (getWindowWidth()-20) + "px";
                    header.style.width = (getWindowWidth()-20) + "px";
                    subheader.style.width = (getWindowWidth()-20) + "px";
                    if (map.updateSize) { map.updateSize(); };
                }

                onresize=function(){ resize(); };

function linkHandler(entity_name) {
    /* close the dropdown */
    $('.dropdown').removeClass('open');

    /* show 'loading ...' */
//    document.getElementById("page_status").innerHTML = 'Loading ...'

    $(function() {
     $.rails.ajax = function (options) {
       options.tryCount= (!options.tryCount) ? 0 : options.tryCount;0;
       options.timeout = 15000*(options.tryCount+1);
       options.retryLimit=3;
       options.complete = function(jqXHR, thrownError) {
         /* complete also fires when error ocurred, so only clear if no error has been shown */
         if(thrownError=="timeout") {
           this.tryCount++;
 //          document.getElementById("page_status").innerHTML = 'Retrying ...';
           this.timeout=15000*this.tryCount;
           if(this.tryCount<=this.retryLimit) {
             $.rails.ajax(this);
           } else {
  //           document.getElementById("page_status").innerHTML = 'Timeout';
           }
         }
         if(thrownError=="error") {
   //        document.getElementById("page_status").innerHTML = 'Error';
         }
         if(thrownError=="success") {
 //          document.getElementById("page_status").innerHTML = ''
         }
         lastUrl=document.URL;
       }

       return $.ajax(options);
     };
   });
}
