var clickMode;
var searchMode;
var site_map_size=1;
var site_selected_layer;
var def_x=null;
var def_y=null;
var def_zoom=null;
var def_layer=null;

// Site-specfic stuff follows - should be in separate file
//

function site_init() {
  map_init_mapspast();
  map_map.addLayer(map_scratch_layer);
  if ($(window).width() < 960) {
    site_smaller_map();
  }
  if(def_x!=null && def_y!=null) {
       var centre='POINT('+def_x+' '+def_y+')';
       map_centre(centre,'EPSG:2193');
  }
  if(def_zoom!=null) {
       map_zoom(def_zoom);
  }
  if(def_layer!=null) {
       map_show_only_layer(def_layer);
  }

}

function site_mapQuery() {
     if (clickMode=="search") {site_deactivateAllQuery();}
     if (clickMode!="query") {
       searchMode="current";
       map_on_click_activate(site_query_callback)

       clickMode="query";
       document.getElementById("mapQuery").style.backgroundColor="#008800"
     } else {
       site_deactivateAllQuery();
     }
  };

function site_mapSearch() {
  if (clickMode=="query") {site_deactivateAllQuery();}
     if (clickMode!="search") {
       searchMode="all";
       map_on_click_activate(site_query_callback)
       clickMode="search";
         document.getElementById("mapSearch").style.backgroundColor="#008800"
     } else {
       site_deactivateAllQuery();
     }
  };

function site_mapKey() {
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
          url: "/legend?projection="+map_current_proj,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          },
          complete: function() {
//              document.getElementById("page_status").innerHTML = '';
          }
        });
}



function site_showUrl() {
        var x=Math.round(map_map.getView().getCenter()[0]);
        var y=Math.round(map_map.getView().getCenter()[1]);
        var z=map_map.getView().getZoom()+5;
        var l=encodeURIComponent(map_current_layer);
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


function site_zoomToMapsheet() {
  layername=map_current_layer;
//  if (layername=="selected sheet") {
  if ((document.extentform.xleft!="Undefined") && (document.extentform.xleft.value>0)) {
    var sheetBounds = new OpenLayers.Bounds(
         document.extentform.xleft.value,
         document.extentform.ybottom.value,
         document.extentform.xright.value,
         document.extentform.ytop.value);
    sheetProjection =new OpenLayers.Projection("EPSG:"+document.extentform.srid.value);
    zoomExtent=sheetBounds.transform(sheetProjection, map_map.projection);
  } else {
    zoomExtent=preferredExtent.transform(map_map.displayProjection, map_map.projection);
  }
  map_map.zoomToExtent(zoomExtent);
  return(zoomExtent);

}


function site_deactivateAllQuery() {
     document.getElementById("mapSearch").style.backgroundColor="rgba(255,255,255,0.4)";
     document.getElementById("mapQuery").style.backgroundColor="rgba(255,255,255,0.4)";
     map_on_click_deactivate(site_query_callback);
     clickMode="";

}


function site_query_callback(e) {
        var xy = map_map.getCoordinateFromPixel(e.pixel);
        var layername;
        if (searchMode=="all") {
          layername="";
        } else {
          layername=map_current_layer;
        };
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
          url: "/query/?x="+xy[0]+"&y="+xy[1]+"&layer="+layername,
          error: function() {
              document.getElementById("info_details2").innerHTML = 'Error contacting server';
          },
          complete: function() {
              /* complete also fires when error ocurred, so only clear if no error has been shown */
//              document.getElementById("page_status").innerHTML = '';
          }

        });

}

function site_add_layers() {
	map_add_raster_layer('NZTM Topo 2009', 'http://au.mapspast.org.nz/topo50/{z}/{x}/{-y}.png', 'mapspast', 4891.969809375, 11);
	map_add_raster_layer('NZMS260 1999', 'http://au.mapspast.org.nz/nzms260-1999/{z}/{x}/{-y}.png', 'mapspast', 4891.969809375, 11);
	map_add_raster_layer('NZMS1/260 1989','http://au.mapspast.org.nz/nzms-1989/{z}/{x}/{-y}.png','mapspast', 4891.969809375, 11);
	map_add_raster_layer('NZMS1 1979', 'http://au.mapspast.org.nz/nzms-1979/{z}/{x}/{-y}.png','mapspast', 4891.969809375, 11);
        map_add_raster_layer('NZMS1 1969','http://au.mapspast.org.nz/nzms-1969/{z}/{x}/{-y}.png','mapspast', 4891.969809375, 11);
        map_add_raster_layer('NZMS1 1959','http://au.mapspast.org.nz/nzms-1959/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('NZMS15 1949','http://au.mapspast.org.nz/nzms15-1949/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('NZMS13 1939','http://au.mapspast.org.nz/nzms13-1939/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11); 
        map_add_raster_layer('NZMS13 1929','http://au.mapspast.org.nz/nzms13-1929/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('NZMS13 1919','http://au.mapspast.org.nz/nzms13-1919/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('NZMS13 1909','http://au.mapspast.org.nz/nzms13-1909/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('NZMS13 1899','http://au.mapspast.org.nz/nzms13-1899/{z}/{x}/{-y}.png','mapspast',4891.969809375, 11);
        map_add_raster_layer('(LINZ) Topo50 latest','http://tiles-a.data-cdn.linz.govt.nz/services;key=d8c83efc690a4de4ab067eadb6ae95e4/tiles/v4/layer=767/EPSG:2193/{z}/{x}/{y}.png','linz',8690, 17);
        map_add_raster_layer('(LINZ) Airphoto latest','http://tiles-a.data-cdn.linz.govt.nz/services;key=d8c83efc690a4de4ab067eadb6ae95e4/tiles/v4/set=2/EPSG:2193/{z}/{x}/{y}.png','linz',8690, 17);
}

function site_add_controls() {
	map_create_control("/assets/cog24.png","Configure map",site_mapKey,"mapKey");
	map_create_control("/assets/layers24.png","Select basemap",map_mapLayers,"mapLayers");
	map_create_control("/assets/link.png","Show URL of currently displayed map",site_showUrl,"showUrl");
	map_create_control("/assets/maxextent.png","Zoom to extent of current mapsheet/series",map_zoom_to_default_extent,"zoomToMapsheet");
	map_create_control("/assets/info24.png","Show mapsheet details for current series when you click on the map",site_mapQuery,"mapQuery");
	map_create_control("/assets/infolist.png","List all available mapsheets at point you click on the map",site_mapSearch,"mapSearch");
}

function site_bigger_map() {
  document.getElementById('map').style.display="none";
  if (site_map_size==1) {
    $('#left_panel_container').toggleClass('span3 span12');
    $('#right_panel').toggleClass('span9 span0');
  setTimeout( function() {document.getElementById('right_panel').style.display="none";}, 100);
    site_map_size=2;
  }

  if (site_map_size==0) {
    $('#left_panel_container').toggleClass('span0 span3');
    $('#right_panel').toggleClass('span12 span9');
    document.getElementById('right_panel').style.marginLeft="25%";
    document.getElementById('right_panel').style.width="75%";
    document.getElementById('map').style.width="75%";
    document.getElementById('left_panel_container').style.display="block";
    site_map_size=1;
  }
  setTimeout( function() {
    map_map.updateSize();
    document.getElementById('map').style.display="block";
    setTimeout( function() { map_map.updateSize(); }, 1000);
    map_map.updateSize();
  }, 200);
  return false ;
}

function site_smaller_map() {

  document.getElementById('map').style.display="none";
  if (site_map_size==1) {
    $('#left_panel_container').toggleClass('span3 span0');
    $('#right_panel').toggleClass('span9 span12');
    document.getElementById('right_panel').style.marginLeft="0px";
    document.getElementById('right_panel').style.width="100%";
    document.getElementById('map').style.width="100%";
    document.getElementById('left_panel_container').style.display="none";
    site_map_size=0;
  }
  if (site_map_size==2) {
    document.getElementById('right_panel').style.display="block";
    $('#left_panel_container').toggleClass('span12 span3');
    $('#right_panel').toggleClass('span0 span9');
    site_map_size=1;
  }

  setTimeout( function() {
    map_map.updateSize();
    document.getElementById('map').style.display="block";
    setTimeout( function() { map_map.updateSize(); }, 1000);
    map_map.updateSize();
  }, 200);

  return false ;
}

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
           if(site_map_size==0) site_bigger_map();
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


function site_zoom_to_seriessheet(name, extent, xleft, xright, ybottom, ytop) {
  map_select_maplayer(name, "", "mapspast", 0, 10) ;
  var format = new WKT();

  document.extentform.xleft.value=xleft;
  document.extentform.xright.value=xright;
  document.extentform.ytop.value=ytop;
  document.extentform.ybottom.value=ybottom;
  document.extentform.srid.value=4326;

  map_clear_scratch_layer();

  var feature=format.readFeature(extent, {
    dataProjection: 'EPSG:4326',
    featureProjection: map_projection_name  });

  innerpoly=feature.getGeometry();
  wkt = ("POLYGON((748961 3808210, 748961 6836339, 2940563 6836339, 2940563 3808210, 748961 3808210))");

  var outerpoly=format.readFeature(wkt, {
    dataProjection: 'EPSG:2193',
    featureProjection: map_projection_name  });
  
  outerpoly.getGeometry().appendLinearRing(innerpoly);

  map_add_feature(outerpoly);

  map_set_default_extent(innerpoly.getExtent());
  map_zoom_to_default_extent();
}

function site_update_selected_layer(layer_id, serverpath, xleft, xright, ytop, ybottom, srid, maxzoom) {
  map_clear_scratch_layer();

  if (typeof(map_map)!='undefined') { 
    ourlayer=map_get_layer_by_name('selected sheet');
    if (ourlayer!=null) {
      map_map.removeLayer(ourlayer);
    }
    site_create_selected_layer(layer_id, serverpath);
    map_show_only_layer('selected sheet');
  }
  document.extentform.xleft.value=xleft;
  document.extentform.xright.value=xright;
  document.extentform.ytop.value=ytop;
  document.extentform.ybottom.value=ybottom;
  document.extentform.srid.value=srid;
  document.extentform.layerid.value=layer_id;
  document.extentform.maxzoom.value=maxzoom;
  document.extentform.serverpath.value=serverpath;

  site_selected_layer.setVisible(true);
  map_set_default_extent([xleft,ybottom,xright,ytop]);
  map_zoom_to_default_extent();
}

function site_create_selected_layer(layer_id, serverpath) {
//  var url="http://au.mapspast.org.nz/tiles-"+layer_id+"/{z}/{x}/{-y}.png";
  var url=serverpath+"tiles-"+layer_id+"/{z}/{x}/{-y}.png";
  site_selected_layer = new TileLayer({
    source: new XYZ({
      projection: epsg2193,
       url: url,
       tileGrid: mapspast_tilegrid,
       maxResolution: 4891.969809375,
       numZoomLevels: 11
     }),
     name: "selected sheet",
     visible: true,
     projection: epsg2193,
     maxResolution: 4891.969809375,
     numZoomLevels: 11
   });
  map_map.addLayer(site_selected_layer);
};




function site_printmap(filetype) {
  var extent=map_map.getView().calculateExtent();
  var xl=extent[0];
  var xr=extent[2];
  var yt=extent[1];
  var yb=extent[3];
  var width=document.selectform.pix_width.value;
  var height=document.selectform.pix_height.value;
  layerid=map_current_layer;
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

