class ViewerController < ApplicationController
  def map
    if params[:print] then @print=true end
    if params[:right] then @dright=params[:right] end
    if params[:left] then @dleft=params[:left] end
    if params[:top] then @dtop=params[:top] end
    if params[:bottom] then @dbottom=params[:bottom] end
    if params[:sheetid] then @dsheetid=params[:sheetid] end
    if params[:wheight] then @wheight=params[:wheight] end
    if params[:wwidth] then @wwidth=params[:wwidth] end
    if params[:layerid] then @selectedlayer=Uploadedmap.find_by_id(params[:layerid]) end
  end

  def print
    @papersize=Papersize.all
  end
end
