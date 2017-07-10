class SeriessheetController < ApplicationController


def index
    @mapsheets=Mapsheet.find_by_sql [ "select * from mapsheets order by name, year_printed" ]

end

def show
  @mapsheet=Mapsheet.find_by_id(params[:id])
  @mapseries=Mapseries.find_by_id(@mapsheet.series_id)
end

end
