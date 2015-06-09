class MapsheetController < ApplicationController
 before_action :signed_in_user, only: [:create, :update, :edit, :destroy]


def show
  @map=Uploadedmap.find_by_id(params[:id])
  if !@map.mapstatus_id then @map.mapstatus_id=1 end
end

def index
  ms1=Mapstatus.find_by(:name => "tiled")
  ms2=Mapstatus.find_by(:name => "compressed")
  if signed_in? then
    @mapsheets=Uploadedmap.all
  else
    @mapsheets=Uploadedmap.find_by_sql [ "select * from uploadedmaps where mapstatus_id = ? or mapstatus_id = ?",ms1.id.to_s, ms2.id.to_s ]
  end

end

def edit
  @map=Uploadedmap.find_by_id(params[:id])
  if !@map then
    redirect_to root_path
  else
    if !@map.mapstatus_id then @map.mapstatus_id=1 end
  end
end

def show
  @map=Uploadedmap.find_by_id(params[:id])
end

def new
   @map=Uploadedmap.new
end

def new_info
end
def destroy
   @map=Uploadedmap.find_by_id(params[:id])
   if @map.createdby_id==@current_user.id or @current_user.roleid==1
     @map.destroy_files
     @map.unpublish
     @map.delete
     redirect_to '/mapsheet'
   else
     render 'show'
   end 
end

def create

  if params[:create]
    @map=Uploadedmap.new
    @map.name=params[:uploadedmap][:name]
    @map.series=params[:uploadedmap][:series]
    @map.edition=params[:uploadedmap][:edition]
    @map.scale=params[:uploadedmap][:scale]
    @map.sheet=params[:uploadedmap][:sheet]
    @map.source=params[:uploadedmap][:source]
    @map.attribution=params[:uploadedmap][:attribution]
    @map.year_printed=params[:uploadedmap][:year_printed]
    @map.year_revised=params[:uploadedmap][:year_revised]
    @map.description=params[:uploadedmap][:description]
    @map.mapstatus=Mapstatus.find_by(:name => "new")
    @map.createdby_id=@current_user.id
    success=@map.save
 end
 if success
    render 'edit'
 else
    render 'new'
 end
end

def update
  @map=Uploadedmap.find_by_id(params[:id])

  if params[:describe]
    @map.name=params[:uploadedmap][:name]
    @map.series=params[:uploadedmap][:series]
    @map.edition=params[:uploadedmap][:edition]
    @map.scale=params[:uploadedmap][:scale]
    @map.sheet=params[:uploadedmap][:sheet]
    @map.source=params[:uploadedmap][:source]
    @map.attribution=params[:uploadedmap][:attribution]
    @map.year_printed=params[:uploadedmap][:year_printed]
    @map.year_revised=params[:uploadedmap][:year_revised]
    @map.description=params[:uploadedmap][:description]
    if !@map.mapstatus_id then @map.mapstatus=Mapstatus.find_by(:name => "new") end
    success=@map.save
  end

  if params[:upload]
     #upload OR download (not both)
     if params[:uploadedmap][:image] then 
       @map.image=params[:uploadedmap][:image]
       @map.url=nil
       @map.save
     else
       if params[:uploadedmap][:url] and params[:uploadedmap][:url].length>0 then 
         @map.url=params[:uploadedmap][:url] 
         @map.mapstatus=Mapstatus.find_by(:name=> "uploading ...")
         @map.save
         Resque.enqueue(Do_upload, @map.id) 
       end
     end
     Resque.enqueue(Do_upload, @map.id) 

  end

 if params[:cropgeo]
     puts "cropgeo"

    @map.mapstatus=Mapstatus.find_by(:name=> "cropping ...")
    @map.crop_done=true
    pix_xtl=params[:uploadedmap][:pix_xtl].to_f 
    pix_ytl=params[:uploadedmap][:pix_ytl].to_f 
    pix_xtr=params[:uploadedmap][:pix_xtr].to_f 
    pix_ytr=params[:uploadedmap][:pix_ytr].to_f 
    pix_xbr=params[:uploadedmap][:pix_xbr].to_f 
    pix_ybr=params[:uploadedmap][:pix_ybr].to_f 
    pix_xbl=params[:uploadedmap][:pix_xbl].to_f 
    pix_ybl=params[:uploadedmap][:pix_ybl].to_f 
    @map.grid_xleft=(pix_xtl+pix_xbl)/2
    @map.grid_xright=(pix_xtr+pix_xbr)/2
    @map.grid_ytop=(pix_ytl+pix_ytr)/2
    @map.grid_ybottom=(pix_ybl+pix_ybr)/2

    @map.save
    Resque.enqueue(Do_cropgeo, @map.id)
  end

  if params[:calculate]
     puts "calc"

    @map.pix_xtl=params[:uploadedmap][:pix_xtl] 
    @map.pix_ytl=params[:uploadedmap][:pix_ytl] 
    @map.pix_xtr=params[:uploadedmap][:pix_xtr] 
    @map.pix_ytr=params[:uploadedmap][:pix_ytr] 
    @map.pix_xbr=params[:uploadedmap][:pix_xbr] 
    @map.pix_ybr=params[:uploadedmap][:pix_ybr] 
    @map.pix_xbl=params[:uploadedmap][:pix_xbl] 
    @map.pix_ybl=params[:uploadedmap][:pix_ybl] 

    @map.pix_xleft=(@map.pix_xtl+@map.pix_xbl)/2
    @map.pix_xright=(@map.pix_xtr+@map.pix_xbr)/2
    @map.pix_ytop=(@map.pix_ytl+@map.pix_ytr)/2
    @map.pix_ybottom=(@map.pix_ybl+@map.pix_ybr)/2

    cutwidth=(@map.pix_xright-@map.pix_xleft)
    cutheight=@map.pix_ybottom-@map.pix_ytop

    rottop=@map.pix_ytr-@map.pix_ytl
    rotright=@map.pix_xtr-@map.pix_xbr
    rotbottom=@map.pix_ybr-@map.pix_ybl
    rotleft=@map.pix_xtl-@map.pix_xbl
    puts rottop, rotright, rotbottom, rotleft, cutwidth, cutheight
    @map.pix_rotation=-1.0*(rottop+rotbottom+(rotright+rotleft)*cutwidth/cutheight)/4
    @map.deg_rotation=Math.atan(@map.pix_rotation.to_f/cutwidth)*180/3.14159
    
    @map.save

  end

  if params[:rotate]
     puts "rotate"

    @map.pix_rotation=params[:uploadedmap][:pix_rotation]
    @map.deg_rotation=params[:uploadedmap][:deg_rotation]
    @map.mapstatus=Mapstatus.find_by(:name=> "rotating ...")
    @map.rotate_done=true

    @map.save
    Resque.enqueue(Do_rotate, @map.id)
  end

 if params[:crop]
     puts "rotate"

    @map.mapstatus=Mapstatus.find_by(:name=> "cropping ...")
    @map.crop_done=true

    @map.save
    Resque.enqueue(Do_crop, @map.id)
  end

 if params[:skiprotate]
     puts "skiprotate"
    @map.mapstatus=Mapstatus.find_by(:name=> "cropped")
    @map.crop_done=true
    @map.rotate_done=true
    @map.save
  end

 if params[:georeference]
     puts "georeference"

    @map.mapstatus=Mapstatus.find_by(:name=> "georeferencing ...")
    @map.source_srid=params[:map][:source_srid]
    @map.pix_xtic1=params[:uploadedmap][:pix_xtic1]
    @map.pix_ytic1=params[:uploadedmap][:pix_ytic1]
    @map.pix_xtic2=params[:uploadedmap][:pix_xtic2]
    @map.pix_ytic2=params[:uploadedmap][:pix_ytic2]
    @map.grid_xtic1=params[:uploadedmap][:grid_xtic1]
    @map.grid_ytic1=params[:uploadedmap][:grid_ytic1]
    @map.grid_xtic2=params[:uploadedmap][:grid_xtic2]
    @map.grid_ytic2=params[:uploadedmap][:grid_ytic2]

    @map.save

    #get scale
    @map.xresolution=1.0*(@map.grid_xtic2-@map.grid_xtic1)/(@map.pix_xtic2-@map.pix_xtic1);
    @map.yresolution=1.0*(@map.grid_ytic2-@map.grid_ytic1)/(@map.pix_ytic2-@map.pix_ytic1);

    #extrapolate corners
    @map.grid_xleft=@map.grid_xtic1-(@map.pix_xtic1*@map.xresolution)    
    @map.grid_ytop=@map.grid_ytic1-(@map.pix_ytic1*@map.yresolution)
    @map.grid_width=@map.pix_width*@map.xresolution
    @map.grid_height=@map.pix_height*@map.yresolution
    @map.grid_xright=@map.grid_width+@map.grid_xleft
    @map.grid_ybottom=@map.grid_height+@map.grid_ytop

    @map.projection_name=Projection.find_by_id(@map.source_srid).name

    @map.save

    @map.do_georeference
    @map.mapstatus=Mapstatus.find_by(:name=> "georeferenced")
  end

  if params[:create]
    puts "create"

    Resque.enqueue(Do_create, @map.id)

  end
  render 'mapsheet/edit'
end

end
