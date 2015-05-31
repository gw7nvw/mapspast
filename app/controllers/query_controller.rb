class QueryController < ApplicationController

def show
  x=params[:x].to_f
  y=params[:y].to_f
  layer=params[:layer]

  layers=Mapseries.find_by_sql [ "select * from mapseries where name=?", layer]
  if(layers and layers.count>0) 
   layer_id=layers[0].id
   @mapsheets=Mapsheet.find_by_point(x,y,2193,layer_id)
  end
 
end

end
