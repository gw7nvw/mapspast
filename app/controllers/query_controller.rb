class QueryController < ApplicationController

def show
  x=params[:x].to_f
  y=params[:y].to_f
  layer=params[:layer]
  if layer=="NZTM Topo 2009" then layer="Topo50 2009" end
  #serach all layers unless one is specified
  layer_id=nil

  if layer and layer.length>0 then
    layers=Mapseries.find_by_sql [ "select * from mapseries where name=?", layer]
    if(layers and layers.count>0)  then
      layer_id=layers[0].id
    end
  end
  @mapsheets=Mapsheet.find_by_point(x,y,2193,layer_id)
 
end

end
