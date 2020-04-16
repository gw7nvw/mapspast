class MapseriesController < ApplicationController

def show
  @mapset=Mapset.find_by_id(params[:id])
  @mapsheets=Uploadedmap.find_by_sql [ "select * from uploadedmaps where series=? order by name, year_printed, sheet", @mapset.name ]
end

def index
  @mapsets=Mapset.find_by_sql [ "select * from mapsets order by name" ]
end

end
