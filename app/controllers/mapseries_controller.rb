class MapseriesController < ApplicationController

def show
  @mapseries=Mapseries.find_by_id(params[:id])
  @mapsheets=Mapsheet.find_by_sql [ "select * from mapsheets where series_id=? order by name, sheet", params[:id] ]
end

def index
  @mapseries=Mapseries.find_by_sql [ "select * from mapseries where name<>'selected sheet' order by name, year_of_snapshot" ]
end

end
