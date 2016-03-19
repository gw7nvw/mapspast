// browser history handler
if (typeof(lastUrl)=='undefined')  var lastUrl=document.URL;

window.onpopstate = function(event)  {
  if (document.URL != lastUrl) location.reload();
};

var map_size=1;

var tiff_map;
var dots="";
var map;
var vectorLayer;
var ourcanvas;
var searchMode;
var cross_red;
var click_to_create;
var click_to_create_grid;
var clickDest;
var clickForm;
var layer_style;
var clickMode=""
var mapBounds = new OpenLayers.Bounds(748961,3808210, 2940563,  6836339);
var preferredExtent = new OpenLayers.Bounds(1078269,4639780, 2098245,  6268806);
var tiffBounds = new OpenLayers.Bounds( -20037508.34,-20037508.34,20037508.34,20037508.34)
var tiffProj="900913";
var mapMinZoom = 0;
var mapMaxZoom = 10;
var emptyTileURL = "http://au.mapspast.org.nz/none.png";
var renderer;
var sheetid;
var layerid;
var mapset="mapspast";
var current_proj="2193"
var current_projname="NZTM2000"
var current_projdp=0;

OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

  


  cross_red = OpenLayers.Util.extend({}, layer_style);
  cross_red.strokeColor = "none";
  cross_red.fillColor = "red";
  cross_red.graphicName = "cross";
  cross_red.pointRadius = 5;
  cross_red.strokeWidth = 0;
  cross_red.rotation = 0;
  cross_red.strokeLinecap = "butt";

function init_mapspast() {
  mapset="mapspast";
  currentextent=mapBounds;
  if(typeof(map)!='undefined') {
     var currentextent=map.getExtent()
     map.destroy();
  }
  do_init();
  map.zoomToExtent(currentextent);
}

function init_linz() {
  mapset="linz";
  currentextent=mapBounds;
  if(typeof(map)!='undefined') {
     currentextent=map.getExtent()
     map.destroy();
  }
  do_init();
  map.zoomToExtent(currentextent);
  map.zoomIn();
}
function init(){
  if(typeof(map)=='undefined') {
    do_init();
  {
    setTimeout( function() { mapLayers();}, 500);
  }

  }
}

function do_init(){

  var centrex=(location.search.split('x=')[1]||'').split('&')[0];
  var centrey=(location.search.split('y=')[1]||'').split('&')[0];
  layerid=decodeURI((location.search.split('layerid=')[1]||'').split('&')[0]);
  var zoom=(location.search.split('zoom=')[1]||'').split('&')[0];

  //Projections
  Proj4js.defs["EPSG:2193"] = "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  Proj4js.defs["EPSG:999999"] = "+proj=tmerc +lat_0=0 +lon_0=167.5 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  Proj4js.defs["EPSG:999998"] = "+proj=tmerc +lat_0=0 +lon_0=170 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  Proj4js.defs["EPSG:999997"] = "+proj=tmerc +lat_0=0 +lon_0=167.625 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
  Proj4js.defs["EPSG:27200"] = "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +ellps=intl +datum=nzgd49 +units=m +no_defs";
  Proj4js.defs["EPSG:27291"] = "+proj=tmerc +lat_0=-39 +lon_0=175.5 +k=1 +x_0=274319.5243848086 +y_0=365759.3658464114 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs";
  Proj4js.defs["EPSG:27292"] = "+proj=tmerc +lat_0=-44 +lon_0=171.5 +k=1 +x_0=457199.2073080143 +y_0=457199.2073080143 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs";
  Proj4js.defs["ESPG:4326"] = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '
  Proj4js.defs["ESPG:4272"] = '+proj=longlat +ellps=intl +datum=nzgd49 +no_defs'
  Proj4js.defs["ESPG:4167"] = '+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs'

  // update map size and start 'don't do again until' timer
  window.onresize = function()
  {
    setTimeout( function() { map.updateSize();}, 1000);
  }

  // map 
     var mapspast_options = {
            projection: new OpenLayers.Projection("EPSG:2193"),
            displayProjection: new OpenLayers.Projection("EPSG:"+current_proj),
            units: "m",
      maxResolution: 4891.969809375,
      numZoomLevels: 11,
      maxExtent: new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508.34)
    };
    var linz_options = {
      projection: new OpenLayers.Projection("EPSG:2193"),
            displayProjection: new OpenLayers.Projection("EPSG:"+current_proj),
            units: "m",
      resolutions: [8960, 4480, 2240, 1120, 560, 280, 140, 70, 28, 14, 7, 2.8, 1.4, 0.7, 0.28, 0.14, 0.07],
      numZoomLevels: 11,
      maxExtent:  new OpenLayers.Bounds(827933.23, 3729820.29, 3195373.59, 7039943.58)
    };

    if (mapset=="mapspast") {
      map = new OpenLayers.Map('map_map', mapspast_options);
    } else {
      map = new OpenLayers.Map('map_map', linz_options);
    }
 
    renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

  map.events.register("moveend", map, check_zoomend);
  // layers
  if (mapset=="mapspast") {

    var nztm2009 = new OpenLayers.Layer.TMS("NZTM Topo 2009", "http://au.mapspast.org.nz/topo50/",
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
  
      var nzms1989 = new OpenLayers.Layer.TMS("NZMS1/260 1989", "http://au.mapspast.org.nz/nzms-1989/",
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
  
    var nzms1969 = new OpenLayers.Layer.TMS("NZMS1 1969", "http://au.mapspast.org.nz/nzms-1969/",
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
    var nzms1949 = new OpenLayers.Layer.TMS("NZMS15 1949", "http://au.mapspast.org.nz/nzms15-1949/",
    {
        serviceVersion: '.',
        layername: '.',
        alpha: true,
        type: 'png',
        isBaseLayer: true,
        getURL: getURL
    });
  
    map.addLayers([nztm2009,nzms1999,nzms1989, nzms1979,nzms1969, nzms1959, nzms1949]);

    if (document.extentform.layerid.value!="") {
      create_selected_layer(document.extentform.layerid.value, document.extentform.serverpath.value);
    }

  } else {
    var linztopo_layer =  new OpenLayers.Layer.TMS( "(LINZ) Topo50 latest", "http://tiles-a.data-cdn.linz.govt.nz/services;key=d8c83efc690a4de4ab067eadb6ae95e4/tiles/v4/layer=767/EPSG:2193/",
      {
           type: 'png',
           getURL: overlay_getLinzTileURL,
           isBaseLayer: true,
           tileOrigin: new OpenLayers.LonLat(-1000000,10000000),
           rowSign: 1
       });
    var air_layer =  new OpenLayers.Layer.TMS( "(LINZ) Airphoto latest", "http://tiles-a.data-cdn.linz.govt.nz/services;key=d8c83efc690a4de4ab067eadb6ae95e4/tiles/v4/set=2/EPSG:2193/",
      { 
           type: 'png',
           getURL: overlay_getLinzTileURL,
           isBaseLayer: true,
           tileOrigin: new OpenLayers.LonLat(-1000000,10000000),
           rowSign: 1
      });

    map.addLayers([linztopo_layer,air_layer]);
  }

  vectorLayer = new OpenLayers.Layer.Vector("Current feature", {
              //renderers: renderer,
              displayInLayerSwitcher:false
          });

  /* create click controllers*/
  add_click_to_query_controller();
  click_to_query = new OpenLayers.Control.Click();
  map.addControl(click_to_query);

  add_click_to_create_controller_grid();
  click_to_create_grid = new OpenLayers.Control.Click();
  map.addControl(click_to_create_grid);
  
  var my_button = new OpenLayers.Control.Button({
    displayClass: 'olControlInfo',
    trigger: mapInfo,
    title: 'Show mapsheet details for current series when you click on the map'
  });
  var search_button = new OpenLayers.Control.Button({
    displayClass: 'olControlSearch',
    trigger: mapSearch,
    title: 'List all available mapsheets at point you click on the map'
  });
  var maxextent_button = new OpenLayers.Control.Button({
    displayClass: 'olControlMaxExtent',
    trigger: zoom_to_mapsheet,
    title: 'Zoom to extent of current mapsheet/series'
  });
  var url_button = new OpenLayers.Control.Button({
    displayClass: 'olControlUrl',
    trigger: showUrl,
    title: 'Show URL of currently displayed map'
  });
  var layer_button = new OpenLayers.Control.Button({
    displayClass: 'olControlLayers',
    trigger: mapLayers,
    title: 'Select basemap'
  });
  var key_button = new OpenLayers.Control.Button({
    displayClass: 'olControlKey',
    trigger: mapKey,
    title: 'Configure map'
  });
 
  var panel = new OpenLayers.Control.Panel({
  //        defaultControl: my_button,
      createControlMarkup: function(control) {
          var button = document.createElement('button'),
              iconSpan = document.createElement('span'),
              textSpan = document.createElement('span');
          iconSpan.innerHTML = '&nbsp;';
          button.appendChild(iconSpan);
          if (control.text) {
              textSpan.innerHTML = control.text;
          }
          button.appendChild(textSpan);
          return button;
     }
  });
  
  panel.addControls([layer_button, key_button, my_button, search_button, maxextent_button, url_button]);
    
  map.addControls([new OpenLayers.Control.Zoom(),
                   new OpenLayers.Control.Navigation(),
                   new OpenLayers.Control.Scale(),
                   panel
                   ]);

  map.addControl(new OpenLayers.Control.MousePosition({
        prefix: current_projname+": ",
        numDigits: current_projdp}));

  if (document.extentform.dsheetid.value=='selected sheet') {
    create_selected_layer(document.extentform.layerid.value, document.extentform.serverpath.value);   
  } 
  map.addLayers([vectorLayer]);
  
  if (document.extentform.dxleft.value!='' && document.extentform.dxright.value!='' && document.extentform.dytop.value!='' && document.extentform.dybottom.value!='')  {
    preferredExtent = new OpenLayers.Bounds(document.extentform.dxleft.value,document.extentform.dybottom.value, document.extentform.dxright.value,  document.extentform.dytop.value);
  }
    map.zoomToExtent(preferredExtent.transform(map.displayProjection, map.projection));
  if (typeof(zoom)!='undefined' && zoom>="0") {
    map.zoomTo(zoom-5);
  }

  if (typeof(centrex)!='undefined' && typeof(centrey)!='undefined') {
    map.panTo([centrex, centrey]);
  }

  if (layerid!='') {
    ourlayer=map.getLayersByName(layerid);
    if (ourlayer.length>0) {
      map.setBaseLayer(ourlayer[0]);
    }
  }

  
  if (document.extentform.dsheetid.value!='') {
    ourlayer=map.getLayersByName(document.extentform.dsheetid.value);
    if (ourlayer.length>0) {
      map.setBaseLayer(ourlayer[0]);
    }
  }
}

function hide_uploaded_map(event) {
   if(typeof(tiff_map)!="undefined") {
     tiff_map.destroy();
     map.innerHTML="";
     do_init();
      if(typeof(document.getElementById("showupload"))!="undefined") {
       document.getElementById("showupload").style.display="block";
       document.getElementById("hideupload").style.display="none";
     }
   }
}
function show_uploaded_map() {
     map.destroy();
     map.innerHTML="";
     init_tiff_map();
     document.getElementById("showupload").style.display="none";
     document.getElementById("hideupload").style.display="block";
}

function init_tiff_map() {       
 var srcProj=new OpenLayers.Projection("EPSG:27291");
                  var mapName=document.selectform.mapName.value;
                  var tiff_options = {
                      div: "map_map",
                      controls: [],
                      projection: "EPSG:900913",
                      displayProjection: new OpenLayers.Projection("EPSG:"+tiffProj),
                      numZoomLevels: 20
                  };
                  tiff_map = new OpenLayers.Map(tiff_options);

    //renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
    //renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;

                  var tmsoverlay = new OpenLayers.Layer.TMS("Preview", "http://mapspast.org.nz/cgi-bin/mapserv?map=/var/www/html/maps/"+mapName+".map&layer=test&mode=tile&tile=",
                  {
                      serviceVersion: '.',
                      layername: '.',
                      alpha: true,
                      type: 'png',
                      isBaseLayer: true,
                      getURL: getTiffURL
                  });

                  tiff_map.addLayers([tmsoverlay]);
                  vectorLayer = new OpenLayers.Layer.Vector("Current feature", {
                              //renderers: renderer,
                              projection: new OpenLayers.Projection("EPSG:900913"),
                              displayInLayerSwitcher:false
                          });
                  vectorLayer.redraw(true);
                  tiff_map.addLayer(vectorLayer);


  //                tiff_map.zoomToExtent(tiffBounds);
                  tiff_map.zoomToExtent(tiffBounds.transform(srcProj, tiff_map.projection));
          
                  tiff_map.addControls([new OpenLayers.Control.Zoom(),
                   new OpenLayers.Control.MousePosition(),
                                   new OpenLayers.Control.Navigation()]);
                  add_click_to_create_controller();
                  click_to_create = new OpenLayers.Control.Click();
                  tiff_map.addControl(click_to_create);

} 
function getURL(bounds) {
  bounds = this.adjustBounds(bounds);
  var layername=map.baseLayer.name;
  var maxzoom;

  if(layername=='selected sheet') {
     maxzoom=document.extentform.maxzoom.value-5;
  } else {
     maxzoom=mapMaxZoom;
  }

  var res = this.getServerResolution();
  var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
  var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
  var z = this.getServerZoom()+5;
  var path = this.serviceVersion + "/" + this.layername + "/" + z + "/" + x + "/" + y + "." + this.type; 
  var url = this.url;
  if (OpenLayers.Util.isArray(url)) {
      url = this.selectUrl(path, url);
  }
  if (mapBounds.intersectsBounds(bounds) && (z >= mapMinZoom+5) && (z <= maxzoom+5)) {
      return url + path;
  } else {
      return emptyTileURL;
  }
} 

function overlay_getLinzTileURL(bounds,url) {
    var res = this.map.getResolution();
    var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
    var y = -Math.round((bounds.top - this.tileOrigin.lat) / (res * this.tileSize.h));
    var z = this.map.getZoom();
    //if (mapBounds.intersectsBounds( bounds ) && z >= mapMinZoom && z <= mapMaxZoom ) {
       //console.log( this.url + z + "/" + x + "/" + y + "." + this.type);
        return this.url + z + "/" + x + "/" + y + "." + this.type;
    //} else {
     //   return "http://www.maptiler.org/img/none.png";
   // }

}
  
           function getTiffURL(bounds) {
                  bounds = this.adjustBounds(bounds);
                  var res = this.getServerResolution();
                  var x = Math.round((bounds.left - this.tileOrigin.lon) / (res * this.tileSize.w));
                  var y = -Math.round((this.tileOrigin.lat+bounds.top) / (res * this.tileSize.h));
                  var z = this.getServerZoom();
                  var path =  x + "+" + y + "+" + z
                  var url = this.url;
                  if (OpenLayers.Util.isArray(url)) {
                      url = this.selectUrl(path, url);
                  }
                  if (tiffBounds.intersectsBounds(bounds) && (z >= mapMinZoom) && (z <= mapMaxZoom)) {
                      return url + path;
                  } else {
                      return url + path;
                      //return emptyTileURL;
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
    document.getElementById("page_status").innerHTML = 'Loading ...'

    $(function() {
     $.rails.ajax = function (options) {
       options.tryCount= (!options.tryCount) ? 0 : options.tryCount;0;
       options.timeout = 5000*(options.tryCount+1);
       options.retryLimit=1;
       options.complete = function(jqXHR, thrownError) {
         /* complete also fires when error ocurred, so only clear if no error has been shown */
         if(thrownError=="timeout") {
           this.tryCount++;
           document.getElementById("page_status").innerHTML = 'Retrying ...';
           this.timeout=15000*this.tryCount;
           if(this.tryCount<=this.retryLimit) {
             $.rails.ajax(this);
           } else {
             document.getElementById("page_status").innerHTML = 'Timeout';
           }
         }
         if(thrownError=="error") {
           document.getElementById("page_status").innerHTML = 'Error';
         }
         if(thrownError=="success") {
           if(map_size==0) map_bigger();
           document.getElementById("page_status").innerHTML = ''
         }
         lastUrl=document.URL;
       }

       return $.ajax(options);
     };
   });
}

   function update_title(title) {
     document.getElementById('logo').innerHTML='MapsPast'+title;
     document.title = 'MapsPast'+title;
}
   function update_heading(title) {
     document.getElementById('logo').innerHTML='MapsPast'+title;
}

function deactivateAllQuery() {

     document.getElementsByClassName("olControlSearchItemInactive")[0].style.backgroundColor="#FFFFFF"
     document.getElementsByClassName("olControlInfoItemInactive")[0].style.backgroundColor="#FFFFFF"
     click_to_query.deactivate();
     clickMode="";
}
function mapInfo() { 
   if (clickMode=="search") {deactivateAllQuery();}
   if (clickMode!="query") {
     searchMode="current";
     click_to_query.activate();
     clickMode="query";
     document.getElementsByClassName("olControlInfoItemInactive")[0].style.backgroundColor="#008800"
   } else {
     deactivateAllQuery();
   }
}

function mapSearch() { 
   if (clickMode=="query") {deactivateAllQuery();}
   if (clickMode!="search") {
     searchMode="all";
     click_to_query.activate();
     clickMode="search";
     document.getElementsByClassName("olControlSearchItemInactive")[0].style.backgroundColor="#008800"
   } else {
     deactivateAllQuery();
   }
}
function add_click_to_query_controller() {
  OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
     defaultHandlerOptions: {
         'single': true,
         'double': true,
         'pixelTolerance': 5,
         'stopSingle': false,
         'stopDouble': false
     },


    initialize: function(options) {
       this.handlerOptions = OpenLayers.Util.extend(
           {}, this.defaultHandlerOptions
       );
       OpenLayers.Control.prototype.initialize.apply(
           this, arguments
       );
       this.handler = new OpenLayers.Handler.Click(
           this, {
               'click': this.trigger
           }, this.handlerOptions
       );
    },

    /*naviagte to selection */
     trigger: function(e) {
        var xy = map.getLonLatFromPixel(e.xy);
        var layername;
        if (searchMode=="all") {
          layername="";
        } else {
          layername=map.baseLayer.name;
        }
        BootstrapDialog.show({
            title: "Selected map sheet",
            message: $('<div id="info_details2">Retrieving ...</div>'),
            size: "size-small"
        });

        $.ajax({
          beforeSend: function (xhr){
            xhr.setRequestHeader("Content-Type","application/javascript");
            xhr.setRequestHeader("Accept","text/javascript");
          },
          type: "GET",
          timeout: 10000,
          url: "/query/?x="+xy.lon+"&y="+xy.lat+"&layer="+layername,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          }, 
          complete: function() {
              /* complete also fires when error ocurred, so only clear if no error has been shown */
              document.getElementById("page_status").innerHTML = '';
          }

        });
    }
  });
 }

function add_click_to_create_controller_grid() {
     OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
     defaultHandlerOptions: {
         'single': true,
         'double': true,
         'pixelTolerance': 0,
         'stopSingle': false,
         'stopDouble': false
     },


    initialize: function(options) {
       this.handlerOptions = OpenLayers.Util.extend(
           {}, this.defaultHandlerOptions
       );
       OpenLayers.Control.prototype.initialize.apply(
           this, arguments
       );
       this.handler = new OpenLayers.Handler.Click(
           this, {
               'click': this.trigger
           }, this.handlerOptions
       );
    },

    trigger: function(e) {
        var lonlat = map.getLonLatFromPixel(e.xy);
       /*convert to map projection */

       var mapProj =  map.projection;
       var dstProj =  new OpenLayers.Projection("EPSG:"+document.getElementById("map_map_srid").value);
       var thisPoint = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(mapProj,dstProj);

         document.getElementById("uploadedmap_grid_x"+clickDest).value=thisPoint.x;
         document.getElementById("uploadedmap_grid_y"+clickDest).value=thisPoint.y;

       /* move the star */
       vectorLayer.destroyFeatures();

       var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
       var pointFeature = new OpenLayers.Feature.Vector(point,null,cross_red);
       vectorLayer.addFeatures(pointFeature);

    }
  });
}
function add_click_to_create_controller() {
     OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
     defaultHandlerOptions: {
         'single': true,
         'double': true,
         'pixelTolerance': 0,
         'stopSingle': false,
         'stopDouble': false
     },


    initialize: function(options) {
       this.handlerOptions = OpenLayers.Util.extend(
           {}, this.defaultHandlerOptions
       );
       OpenLayers.Control.prototype.initialize.apply(
           this, arguments
       );
       this.handler = new OpenLayers.Handler.Click(
           this, {
               'click': this.trigger
           }, this.handlerOptions
       );
    },

    trigger: function(e) {
        var lonlat = tiff_map.getLonLatFromPixel(e.xy);

       if (tiffProj=="900913") {
         /*convert to pixels */
         projWidth=20037508.34;
         mapWidth=Number(document.selectform.pix_width.value);
         mapHeight=Number(document.selectform.pix_height.value);
         if(mapWidth>mapHeight) {
           x=(lonlat.lon+projWidth)*mapWidth/(projWidth*2);
           y=(-lonlat.lat+projWidth)*mapWidth/(projWidth*2)+(mapHeight-mapWidth)/2;
         } else {
           x=(lonlat.lon+projWidth)*mapHeight/(projWidth*2)+(mapWidth-mapHeight)/2;
           y=(-lonlat.lat+projWidth)*mapHeight/(projWidth*2);
         }
       } else {
         // use map proejection
         var thisPoint = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat).transform(tiff_map.projection,tiff_map.displayProjection);
         x=thisPoint.x;
         y=thisPoint.y;

       }
       
         document.getElementsByName("uploadedmap[pix_x"+clickDest+"]")[clickForm].value=x;
         document.getElementsByName("uploadedmap[pix_y"+clickDest+"]")[clickForm].value=y;

       /* move the star */
       vectorLayer.destroyFeatures();

       var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
       var pointFeature = new OpenLayers.Feature.Vector(point,null,cross_red);
       vectorLayer.addFeatures(pointFeature);

    }
  });
}

function selectPix(form, dest) {
  if (typeof(tiff_map)=='undefined') {
    show_uploaded_map();
  } else {
    if (!tiff_map.layers) { show_uploaded_map() };
  }

  selectNothing();
  document.getElementById(dest+form+"plus").style.border="2px solid lightgreen";
  clickDest=dest;
  clickForm=form;
  vectorLayer.destroyFeatures();
  deactivate_all_click();
  click_to_create.activate();
  //map_enable_draw_point();
}

function selectGrid(dest) {
  if (typeof(map)=='undefined') {
    hide_uploaded_map();
  } else {
    if (!map.layers) { hide_uploaded_map() };
  }
  if(document.getElementById("map_map_srid").value=="") { 
     alert("You must select a projection first");
  } else {
    selectNothing();
    document.getElementById("grid"+dest+"plus").style.border="2px solid lightgreen";
    clickDest=dest;
    vectorLayer.destroyFeatures();
    deactivate_all_click();
    click_to_create_grid.activate();
  }
  //map_enable_draw_point();

}

function selectNothing() {
//  document.getElementById("placeplus").style.display="block";
//  document.getElementById("placetick").style.display="none";

  /* resisplay all point / lines from from */
  document.getElementById("tl0plus").style.border="none";
  document.getElementById("tr0plus").style.border="none";
  document.getElementById("br0plus").style.border="none";
  document.getElementById("bl0plus").style.border="none";
  document.getElementById("tl1plus").style.border="none";
  document.getElementById("tr1plus").style.border="none";
  document.getElementById("br1plus").style.border="none";
  document.getElementById("bl1plus").style.border="none";
  document.getElementById("tic10plus").style.border="none";
  document.getElementById("tic20plus").style.border="none";
  document.getElementById("gridtic1plus").style.border="none";
  document.getElementById("gridtic2plus").style.border="none";

  deactivate_all_click();
}

function deactivate_all_click() {
    if(typeof(click_to_create)!='undefined') click_to_create.deactivate();
}

function zoom_to_mapsheet() {
  layername=map.baseLayer.name;
  if (layername=="selected sheet") {
    var sheetBounds = new OpenLayers.Bounds(
         document.extentform.xleft.value, 
         document.extentform.ybottom.value, 
         document.extentform.xright.value, 
         document.extentform.ytop.value);
    sheetProjection =new OpenLayers.Projection("EPSG:"+document.extentform.srid.value);
    map.zoomToExtent(sheetBounds.transform(sheetProjection, map.projection));
  } else {
    map.zoomToExtent(preferredExtent.transform(map.displayProjection, map.projection));
  }
}

function update_selected_layer(layer_id, serverpath, xleft, xright, ytop, ybottom, srid, maxzoom) {
  if (typeof(map)!='undefined') { 
    if (mapset!="mapspast") { init_mapspast(); }
    ourlayer=map.getLayersByName("selected sheet");
    if (ourlayer.length>0) {
      map.removeLayer(ourlayer[0]);
    }
    create_selected_layer(layer_id, serverpath);
    ourlayer=map.getLayersByName("selected sheet");
    if (ourlayer.length>0) {
      map.setBaseLayer(ourlayer[0]);
    }
  }
  document.extentform.xleft.value=xleft;
  document.extentform.xright.value=xright;
  document.extentform.ytop.value=ytop;
  document.extentform.ybottom.value=ybottom;
  document.extentform.srid.value=srid;
  document.extentform.layerid.value=layer_id;
  document.extentform.maxzoom.value=maxzoom;
  document.extentform.serverpath.value=serverpath;
  
}

function create_selected_layer(layer_id, serverpath) {

  var sheetLayer = new OpenLayers.Layer.TMS("selected sheet", serverpath+"tiles-"+layer_id+"/",
  {
      serviceVersion: '.',
      layername: '.',
      alpha: true,
      type: 'png',
      isBaseLayer: true,
      getURL: getURL
  });

  sheetid=layer_id;
  map.addLayer(sheetLayer);
}


function pollStatus() {
    setTimeout(function() {
         document.getElementById("page_status").innerHTML = 'Processing ...'
        $.ajax({
            url: "/mapsheet/"+document.selectform.mapid.value+"/status",
            type: "GET",
            success: function(data) {
              var mapStatus=data.mapStatus;
              if(mapStatus.substr(mapStatus.length-3)!='...') {    
//                alert("Please refresh your browser");
                thisUrl=window.location.href;
                if(thisUrl.substr(thisUrl.length-4)!='edit') {  
                     thisUrl=thisUrl+'/edit'; 
                }  
                window.location=thisUrl;
              } else {
                ms=mapStatus.substr(0,mapStatus.length-3);
                if (dots=="...") { dots="."; } else { dots=dots+"."; }
                document.getElementById("mapstatus").innerHTML=ms+dots; 
//                pollStatus();
              };
            },
            dataType: "json",
            always: pollStatus(),
            timeout: 5000
        })
    }, 5000);
};

function check_zoomend() {
  var layername=map.baseLayer.name;
  var maxzoom;

  if(layername=='selected sheet') {
     maxzoom=document.extentform.maxzoom.value-5;
  } else {
     maxzoom=mapMaxZoom;
  }
  var x = map.getZoom();
  if(x>maxzoom) setTimeout( function() { map.zoomTo(maxzoom);}, 100);
  if(x<mapMinZoom) setTimeout( function() { map.zoomTo(mapMinZoom);}, 100);
}
        
function showInfo(title, url) {
        BootstrapDialog.show({
            title: title,
            message: $('<div id="info_details2">Retrieving ...</div>'),
            size: "size-normal"
        });

        $.ajax({
          beforeSend: function (xhr){
            xhr.setRequestHeader("Content-Type","application/javascript");
            xhr.setRequestHeader("Accept","text/javascript");
          },
          type: "GET",
          timeout: 7000,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          }, 
          url: url,
          complete: function() {
              /* complete also fires when error ocurred, so only clear if no error has been shown */
              document.getElementById("page_status").innerHTML = '';
          }

        });
}

function showUrl() {
        var x=Math.round(map.getCenter().lon);
        var y=Math.round(map.getCenter().lat);
        var z=map.getZoom()+5;
        var l=encodeURIComponent(map.baseLayer.name);
        if (l=='selected%20sheet') { 
           url=document.location.origin+'/mapsheet/'+document.extentform.layerid.value;
           var l_id="";
        } else {
           var l_id="&layerid="+l;
           url=document.location.origin; 
        }

        BootstrapDialog.show({
            title: "URL of current map",
            message: $("<input id='url' value='"+url+"/?zoom="+z+"&x="+x+"&y="+y+l_id+"' />")
        });
}

function printmap(filetype) {
  var xl=map.getExtent().left;
  var xr=map.getExtent().right;
  var yt=map.getExtent().top;
  var yb=map.getExtent().bottom;
  var width=document.selectform.pix_width.value;
  var height=document.selectform.pix_height.value;
  layerid=map.baseLayer.name;
  sheetid=document.extentform.layerid.value;
  var maxzoom=document.extentform.maxzoom.value;
  var filename=document.selectform.filename.value;
  if (document.extentform.serverpath.value=="http://mapspast.org.nz/") {
    window.open('http://mapspast.org.nz/assets/print.html?print=true&left='+xl+'&right='+xr+'&top='+yt+'&bottom='+yb+'&sheetid='+sheetid+'&layerid='+layerid+'&wwidth='+width+'&wheight='+height+'&maxzoom='+maxzoom+'&filetype='+filetype+'&filename='+filename, 'printwindow');

  } else {
    window.open('http://au.mapspast.org.nz/print.html?print=true&left='+xl+'&right='+xr+'&top='+yt+'&bottom='+yb+'&sheetid='+sheetid+'&layerid='+layerid+'&wwidth='+width+'&wheight='+height+'&maxzoom='+maxzoom+'&filetype='+filetype+'&filename='+filename, 'printwindow');
  }
  return false;
}

function generate_prj() {
      filename=document.selectform.filename.value;
      var blob = new Blob(['PROJCS["NZGD_2000_New_Zealand_Transverse_Mercator",GEOGCS["GCS_NZGD_2000",DATUM["D_NZGD_2000",SPHEROID["GRS_1980",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Transverse_Mercator"],PARAMETER["False_Easting",1600000.0],PARAMETER["False_Northing",10000000.0],PARAMETER["Central_Meridian",173.0],PARAMETER["Scale_Factor",0.9996],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]'], {type: "text/plain"});
      saveAs(blob, filename+".prj");
}


function updateDimensions() {
   var papersize=document.selectform.size.value

   document.selectform.pix_width.value=paperwidths[papersize];
   document.selectform.pix_height.value=paperheights[papersize];
}

function mapKey() {
        BootstrapDialog.show({
            title: "Map options",
            message: $('<div id="info_details2">Retrieving ...</div>'),
            size: "size-small"
        });

        $.ajax({
          beforeSend: function (xhr){
            xhr.setRequestHeader("Content-Type","application/javascript");
            xhr.setRequestHeader("Accept","text/javascript");
          },
          type: "GET",
          timeout: 10000,
          url: "/legend?projection="+current_proj,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          },
          complete: function() {
              document.getElementById("page_status").innerHTML = '';
          }
        });
}
function mapLayers() {
        BootstrapDialog.show({
            title: "Select basemap",
            message: $('<div id="info_details2">Retrieving ...</div>'),
            size: "size-small"
        });

        $.ajax({
          beforeSend: function (xhr){
            xhr.setRequestHeader("Content-Type","application/javascript");
            xhr.setRequestHeader("Accept","text/javascript");
          },
          type: "GET",
          timeout: 10000,
          url: "/layerswitcher?baselayer="+map.baseLayer.name,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          },
          complete: function() {
              document.getElementById("page_status").innerHTML = '';
          }

        });

}

 function select_maplayer(name, url, basemap, minzoom, maxzoom) {
    $.each(BootstrapDialog.dialogs, function(id, dialog){
        dialog.close();
    });
      if(mapset=="mapspast" && basemap=="linz") {
        init_linz();
      }
      if(mapset=="linz" && basemap=="mapspast") {
        init_mapspast();
      }
      var thenewbase = map.getLayersByName(name)[0];
      map.setBaseLayer(thenewbase);
      map.baseLayer.setVisibility(true);
      if (name=="selected sheet") { 
        maxzoom=document.extentform.maxzoom.value-5; 
      }
      mapMinZoom=minzoom;
      mapMaxZoom=maxzoom;
      if (map.getZoom()>maxzoom) {
        setTimeout( function() { check_zoomend();}, 500);
      }
}

function updateProjection() {
            current_proj=document.getElementById("projections").value;
            current_projname=getSelectedText("projections");
            //WGS 4dp, otherwise 0
            if(current_proj=="4326" || current_proj=="4272" || current_proj=="4167") { current_projdp=4 } else { current_projdp=0 };
            $.each(BootstrapDialog.dialogs, function(id, dialog){
                dialog.close();
            });
            if (mapset=="mapspast") {
              init_mapspast();
            } else {
              init_linz();
            }
}
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);

    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}


function map_bigger() {
  document.getElementById('map_map').style.display="none";
  if (map_size==1) {
    $('#left_panel_container').toggleClass('span3 span12');
    $('#right_panel').toggleClass('span9 span0');
  setTimeout( function() {document.getElementById('right_panel').style.display="none";}, 100);
    map_size=2;
  }

  if (map_size==0) {
    $('#left_panel_container').toggleClass('span0 span3');
    $('#right_panel').toggleClass('span12 span9');
    document.getElementById('right_panel').style.marginLeft="25%";
    document.getElementById('right_panel').style.width="75%";
    document.getElementById('map_map').style.width="75%";
    document.getElementById('left_panel_container').style.display="block";
    map_size=1;
  }
  setTimeout( function() {
    map.updateSize();
    document.getElementById('map_map').style.display="block";
    setTimeout( function() { map.updateSize(); }, 1000);
    map.updateSize();
  }, 200);
  return false ;
}

function map_smaller() {

  document.getElementById('map_map').style.display="none";
  if (map_size==1) {
    $('#left_panel_container').toggleClass('span3 span0');
    $('#right_panel').toggleClass('span9 span12');
    document.getElementById('right_panel').style.marginLeft="0px";
    document.getElementById('right_panel').style.width="100%";
    document.getElementById('map_map').style.width="100%";
    document.getElementById('left_panel_container').style.display="none";
    map_size=0;
  }
  if (map_size==2) {
    document.getElementById('right_panel').style.display="block";
    $('#left_panel_container').toggleClass('span12 span3');
    $('#right_panel').toggleClass('span0 span9');
    map_size=1;
  }

  setTimeout( function() {
    map.updateSize();
    document.getElementById('map_map').style.display="block";
    setTimeout( function() { map.updateSize(); }, 1000);
    map.updateSize();
  }, 200);

  return false ;
}

