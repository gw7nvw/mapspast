// browser history handler
if (typeof(lastUrl)=='undefined')  var lastUrl=document.URL;

window.onpopstate = function(event)  {
  if (document.URL != lastUrl) location.reload();
};

var tiff_map;

var map;
var vectorLayer;
var cross_red;
var click_to_create;
var click_to_create_grid;
var clickDest;
var layer_style;
//var renderer;
var clickMode=""
var mapBounds = new OpenLayers.Bounds(748961,3808210, 2940563,  6836339);
var tiffBounds = new OpenLayers.Bounds( -20037508.34,-20037508.34,20037508.34,20037508.34)
var mapMinZoom = 5;
var mapMaxZoom = 14;
var emptyTileURL = "http://www.maptiler.org/img/none.png";
OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;

function init_resize() {
  // Window resize handling
  var padding = 10;
  var containerWidth= $("#main_page").width()-padding;
  $(".panel").resizable({
    handles: 'e',
    maxWidth: containerWidth-120,
    minWidth: 120,
    resize: function(event, ui){
      var currentWidth = ui.size.width;
      // set the content panel width
      $("#right_panel").css('margin-left', currentWidth+padding*2+'px' );
      $("#map_map").width(containerWidth - currentWidth-padding*2);
      $("#right_panel").width(containerWidth);
      $("#left_panel_container").width(currentWidth);

    }
  });

}

  cross_red = OpenLayers.Util.extend({}, layer_style);
  cross_red.strokeColor = "none";
  cross_red.fillColor = "red";
  cross_red.graphicName = "cross";
  cross_red.pointRadius = 5;
  cross_red.strokeWidth = 0;
  cross_red.rotation = 0;
  cross_red.strokeLinecap = "butt";

function init(){

  init_resize();
  // update map size and start 'don't do again until' timer
  window.onresize = function()
  {
    setTimeout( function() { map.updateSize();}, 1000);
  }


  //Projections
  Proj4js.defs["EPSG:2193"] = "+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs";
  Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
  Proj4js.defs["EPSG:27200"] = "+proj=nzmg +lat_0=-41 +lon_0=173 +x_0=2510000 +y_0=6023150 +ellps=intl +datum=nzgd49 +units=m +no_defs";
  Proj4js.defs["EPSG:27291"] = "+proj=tmerc +lat_0=-39 +lon_0=175.5 +k=1 +x_0=274319.5243848086 +y_0=365759.3658464114 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs";
  Proj4js.defs["EPSG:27292"] = "+proj=tmerc +lat_0=-44 +lon_0=171.5 +k=1 +x_0=457199.2073080143 +y_0=457199.2073080143 +ellps=intl +datum=nzgd49 +to_meter=0.9143984146160287 +no_defs";
  Proj4js.defs["ESPG:4326"] = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs '

  // map 
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
  

  // layers
  var nztm2009 = new OpenLayers.Layer.TMS("Topo50 2009", "http://au.mapspast.org.nz/topo50/",
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

  var sheetLayer = new OpenLayers.Layer.TMS("selected sheet", "http://mapspast.org.nz/maps/tiles-1/",
  {
      serviceVersion: '.',
      layername: '.',
      alpha: true,
      type: 'png',
      isBaseLayer: true,
      getURL: getURL
  });

  vectorLayer = new OpenLayers.Layer.Vector("Current feature", {
              //renderers: renderer,
              displayInLayerSwitcher:false
          });
  map.addLayers([ nztm2009, nzms1999, nzms1989, nzms1979, nzms1969, nzms1959, vectorLayer, sheetLayer]);

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
title: 'Show map sheet details when you click on the map'
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

    panel.addControls([my_button])
    
    map.addControl(panel);
  // controllers
  var switcherControl = new OpenLayers.Control.LayerSwitcher();
  map.addControl(switcherControl);
  switcherControl.maximizeControl();

  map.zoomToExtent(mapBounds.transform(map.displayProjection, map.projection));
  map.zoomIn()
          
  map.addControls([new OpenLayers.Control.Zoom(),
                   new OpenLayers.Control.Navigation(),
                   new OpenLayers.Control.MousePosition(),
                   new OpenLayers.Control.Scale()]);
}

function hide_uploaded_map(event) {
     tiff_map.destroy();
     map_map.innerHTML="";
     init();
     document.getElementById("showupload").style.display="block";
     document.getElementById("hideupload").style.display="none";
}
function show_uploaded_map(event) {
     map.destroy();
     map_map.innerHTML="";
     init_tiff_map();
     document.getElementById("showupload").style.display="none";
     document.getElementById("hideupload").style.display="block";
}

function init_tiff_map() {       
  Proj4js.defs["EPSG:900913"] = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs";
                  var mapName=document.selectform.mapName.value;
                  var tiff_options = {
                      div: "map_map",
                      controls: [],
                      projection: "EPSG:900913",
                      displayProjection: new OpenLayers.Projection("EPSG:900913"),
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


                  tiff_map.zoomToExtent(tiffBounds);
          
                  tiff_map.addControls([new OpenLayers.Control.Zoom(),
                                   new OpenLayers.Control.Navigation()]);
                  add_click_to_create_controller();
                  click_to_create = new OpenLayers.Control.Click();
                  tiff_map.addControl(click_to_create);

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

   function update_title(title) {
     document.getElementById('logo').innerHTML='MapsPast'+title;
     document.title = 'MapsPast'+title;
}

function mapInfo() { 
   if (clickMode!="query") {
     click_to_query.activate();
     clickMode="query";
     document.getElementsByClassName("olControlInfoItemInactive")[0].style.backgroundColor="#008800"
     document.getElementById("info_details").style.display="block";
   } else {
     click_to_query.deactivate();
     clickMode="";
     document.getElementsByClassName("olControlInfoItemInactive")[0].style.backgroundColor="#FFFFFF"
     document.getElementById("info_details").style.display="none";
     document.getElementById("info_details").innerHTML="";
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
          timeout: 20000,
          url: "/query/?x="+xy.lon+"&y="+xy.lat+"&layer="+map.baseLayer.name,
          complete: function() {
              /* complete also fires when error ocurred, so only clear if no error has been shown */
//              document.getElementById("page_status").innerHTML = '';
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
       var dstProj =  new OpenLayers.Projection("EPSG:"+document.getElementById("map_source_srid").value);
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

       /*convert to pexels */
       projWidth=20037508.34;
       mapWidth=document.selectform.pix_width.value;
       mapHeight=document.selectform.pix_height.value;
       if(mapWidth>mapHeight) {
         x=(lonlat.lon+projWidth)*mapWidth/(projWidth*2);
         y=(-lonlat.lat+projWidth)*mapWidth/(projWidth*2)+(mapHeight-mapWidth)/2;
       } else {
         x=(lonlat.lon+projWidth)*mapHeight/(projWidth*2)+(mapWidth-mapHeight)/2;
         y=(-lonlat.lat+projWidth)*mapHeight/(projWidth*2);
       }

         document.getElementById("uploadedmap_pix_x"+clickDest).value=x;
         document.getElementById("uploadedmap_pix_y"+clickDest).value=y;

       /* move the star */
       vectorLayer.destroyFeatures();

       var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
       var pointFeature = new OpenLayers.Feature.Vector(point,null,cross_red);
       vectorLayer.addFeatures(pointFeature);

    }
  });
}

function selectPix(dest) {
  selectNothing();
  document.getElementById(dest+"plus").style.border="2px solid lightgreen";
  clickDest=dest;
  vectorLayer.destroyFeatures();
  deactivate_all_click();
  click_to_create.activate();
  //map_enable_draw_point();
}

function selectGrid(dest) {
  if(document.getElementById("map_source_srid").value=="") { 
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
  document.getElementById("tlplus").style.border="none";
  document.getElementById("trplus").style.border="none";
  document.getElementById("brplus").style.border="none";
  document.getElementById("blplus").style.border="none";
  document.getElementById("tic1plus").style.border="none";
  document.getElementById("tic2plus").style.border="none";
  document.getElementById("gridtic1plus").style.border="none";
  document.getElementById("gridtic2plus").style.border="none";

  deactivate_all_click();
}

function deactivate_all_click() {
    if(typeof(click_to_create)!='undefined') click_to_create.deactivate();
}

