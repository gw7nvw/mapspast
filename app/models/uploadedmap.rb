class Uploadedmap < ActiveRecord::Base
has_attached_file :image,
  :path => "/var/www/html/maps/:id.:extension",
  :url => "/maps/:id.:extension"

validates_attachment_content_type :image, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif", "image/tif", "image/jp2"]

belongs_to :mapstatus

def destroy_files
  if (self.filename and self.filename.length>0)
    cmd="rm  /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )

    cmd="rm  /var/www/html/maps/"+self.id.to_s+".map"
    puts "Running "+cmd
    success = system( cmd )

    cmd="rm -r /var/www/html/mapspast/public/tiles/tiles-"+self.id.to_s
    puts "Running "+cmd
    success2 = system( cmd )
  end

  (success and success2)
end

def is_image?
   if self.filename
      cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep Driver:"
      filetype=`#{cmd}`
      if filetype and filetype[0..5]=="Driver" then true else false end
   end
end

def is_tiff?
   if self.filename
      cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep Driver: | cut -c9-"
      filetype=`#{cmd}`
      if filetype and filetype[0..4]=="GTiff" then true else false end
   end
end
def is_geotiff?
   if self.filename
      #check for geotiff
      cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep AUTHORITY | tail -n 1"
      projection=`#{cmd}`
      if projection and projection.length>0 then true 
      else 
        #maybe a TFW.  Check if it has a resolution and if we know the projection
        cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep 'Pixel Size' | tail -n 1"
        projection=`#{cmd}`
        if projection and projection.length>0 and projection[0..4]="Pixel" and self.source_srid and self.source_srid>0 then true else false end

      end
  end
end

def is_palette?
   if self.filename
      cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep Palette | tail -n 1"
      palette=`#{cmd}`
      if palette and palette.length>0 then true else false end
  end
end

def is_rgba?
   if self.filename
      cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep 'Band 4' | tail -n 1"
      rgba=`#{cmd}`
      if rgba and rgba.length>0 then true else false end
  end
end

def get_projection_from_gtiff
   cmd="gdalinfo /var/www/html/maps/"+self.filename+" | grep AUTHORITY | tail -n 1"
   projection=`#{cmd}`

   prj=projection.split('"')
   if prj and prj.count>2 and prj[1]=="EPSG"
     srid=prj[3].to_i
     self.source_srid=srid
   end

   proj=Projection.find_by(:id => srid)
   if proj then
     self.projection_name=proj.name
   end
  
   srid
end



def get_size_from_gtiff
   cmd="gdalinfo /var/www/html/maps/"+self.filename+"| grep 'Size is' | sed -e 's/\,//g' | tail -n 1"
   str=`#{cmd}`

   arr=str.split(' ')
   
   if arr and arr.count>2 and arr[0]=="Size"
     x=arr[2].to_i
     y=arr[3].to_i
     self.pix_width=x
     self.pix_height=y
     self.pix_xleft=0
     self.pix_xright=x
     self.pix_ytop=0
     self.pix_ybottom=y
   end  
   #Preload top-left and bottom-right into TICs
   if !self.pix_xtic1 then self.pix_xtic1=0 end
   if !self.pix_ytic1 then self.pix_ytic1=0 end
   if !self.pix_xtic2 then self.pix_xtic2=x end
   if !self.pix_ytic2 then self.pix_ytic2=y end
   if x and y then [x, y] else nil end
end
   
def get_extent_from_gtiff
   cmd="gdalinfo /var/www/html/maps/"+self.filename+"| grep 'Upper Left' | sed -e 's/\,//g' | tail -n 1"
   str=`#{cmd}`

   arr=str.split(' ')

   if arr and arr.count>4 and arr[0]=="Upper"
     self.grid_xleft=arr[3].to_f
     self.grid_ytop=arr[4].to_f
   end

   cmd="gdalinfo /var/www/html/maps/"+self.filename+"| grep 'Lower Right' | sed -e 's/\,//g' | tail -n 1"
   str=`#{cmd}`

   arr=str.split(' ')

   if arr and arr.count>4 and arr[0]=="Lower"
     self.grid_xright=arr[3].to_f
     self.grid_ybottom=arr[4].to_f
   end

   self.grid_width=(self.grid_xright-self.grid_xleft).abs
   self.grid_height=(self.grid_ytop-self.grid_ybottom).abs

 [ self.grid_xleft, self.grid_xright,  self.grid_ytop, self.grid_ybottom]
end

def get_resolution_from_gtiff
   cmd="gdalinfo /var/www/html/maps/"+self.filename+"| grep 'Pixel Size' | sed -e 's/,/ /g' | sed -e 's/(/ /g'| sed -e 's/)/ /g' | tail -n 1"
   str=`#{cmd}`

   arr=str.split(' ')

   if arr and arr.count>3 and arr[0]=="Pixel"
     self.xresolution=arr[3].to_f.abs
     self.yresolution=arr[4].to_f.abs
   end

   [self.xresolution, self.yresolution]
end

def get_all_from_gtiff
    self.get_resolution_from_gtiff
    self.get_projection_from_gtiff
    self.get_size_from_gtiff
    self.get_extent_from_gtiff
    self.create_extent_polygon
end

def create_extent_polygon
  fromproj4s= Projection.find_by_id(self.source_srid).proj4
  toproj4s=  Projection.find_by_id(4326).proj4

  fromproj=RGeo::CoordSys::Proj4.new(fromproj4s)
  toproj=RGeo::CoordSys::Proj4.new(toproj4s)

  topleft=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.grid_xleft, self.grid_ytop))
  topright=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.grid_xright, self.grid_ytop))
  bottomleft=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.grid_xleft, self.grid_ybottom))
  bottomright=arr_to_s(RGeo::CoordSys::Proj4::transform_coords(fromproj,toproj,self.grid_xright, self.grid_ybottom))

  self.extent="POLYGON (("+topleft+","+topright+","+bottomright+","+bottomleft+","+topleft+"))"


end

def calc_max_zoom
   if (self.xresolution and self.yresolution)
     minres=[self.xresolution, self.yresolution].min
     zoomres=2445.984906875 
     zoom=6
     while zoomres>minres
       zoomres=zoomres/2
       zoom+=1
     end
   end    
   self.maxzoom=zoom

end
def calc_resolution
 if (self.grid_width and self.grid_height and self.pix_width and self.pix_height)
   self.xresolution=self.grid_width/self.pix_width
   self.yresolution=self.grid_height/self.pix_height
   self.calc_max_zoom
 end
  
 [self.xresolution, self.yresolution, self.maxzoom]
end

def do_upload
  if self.url
     cmd="wget "+self.url+" -O /var/www/html/maps/"+self.filename+" --no-check-certificate"
     puts "Running "+cmd
     success = system( cmd )
  success
  else false end
end

def do_nearwhite_nongeo
    cmd='mogrify /var/www/html/maps/'+self.filename+' -format tif -fill "#FFFFFF" -opaque "#FEFEFE"'
    puts "Running "+cmd
    success = system( cmd )
end

def do_nearwhite
  cmd="listgeo /var/www/html/maps/"+self.filename+" > /var/www/html/maps/"+self.filename+".geo"
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd='mogrify /var/www/html/maps/'+self.filename+' -format tif -fill "#FFFFFF" -opaque "#FEFEFE"'
    puts "Running "+cmd
    success = system( cmd )
  end
  
  if success  
    cmd="geotifcp -g /var/www/html/maps/"+self.filename+".geo /var/www/html/maps/"+self.filename+" /var/www/html/maps/"+self.filename+"_nearwht.tif"
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="rm /var/www/html/maps/"+self.filename+".geo /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_nearwht.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  success
end

def do_convert_to_tiff
  cmd='gdal_translate  /var/www/html/maps/'+self.filename+'  /var/www/html/maps/'+self.filename+'.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  self.filename=self.filename+'.tif'
end

def do_expand_palette
  cmd='gdal_translate  /var/www/html/maps/'+self.filename+' -ot byte -expand rgb /var/www/html/maps/'+self.filename+'_rgb.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_rgb.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end
  success
end
def do_rotate_nongeo
  cmd='convert  /var/www/html/maps/'+self.filename+' -page +0+0 -rotate '+self.deg_rotation.to_s+' /var/www/html/maps/'+self.filename+'_rotate.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_rotate.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end
  success
end

def do_crop_nongeo
  newwidth=self.pix_xright-self.pix_xleft
  newheight=self.pix_ybottom-self.pix_ytop
  cmd='convert  /var/www/html/maps/'+self.filename+' -crop '+newwidth.to_s+'x'+newheight.to_s+'+'+self.pix_xleft.to_s+'+'+self.pix_ytop.to_s+' /var/www/html/maps/'+self.filename+'_crop.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    self.pix_xleft=0
    self.pix_xright=newwidth
    self.pix_width=newwidth
    self.pix_ytop=0
    self.pix_ybottom=newheight
    self.pix_height=newheight
 
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_crop.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end
  success
end
 

def do_warp
  cmd='gdalwarp -overwrite -s_srs EPSG:'+self.source_srid.to_s+' -t_srs EPSG:2193 -r bilinear -dstnodata 255 -of Gtiff /var/www/html/maps/'+self.filename+' /var/www/html/maps/'+self.filename+'_warp.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_warp.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  self.get_all_from_gtiff

  success
end

def do_to_rgb
  cmd='gdal_translate /var/www/html/maps/'+self.filename+' /var/www/html/maps/'+self.filename+'_rgb.tif -b 1 -b 2 -b 3'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /var/www/html/maps/"+self.filename+"_rgb.tif /var/www/html/maps/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  success

end

def do_tile
  cmd='gdal2tiles.py -z 5-'+self.maxzoom.to_s+' -r bilinear --srcnodata 255 /var/www/html/maps/'+self.filename+' /var/www/html/maps/tiles-'+self.id.to_s
  puts "Running "+cmd
  success = system( cmd )

  success
end

def do_georeference
cmd ="echo '"+self.xresolution.to_s+"\n0\n0\n"+(self.yresolution).to_s+"\n"+self.grid_xleft.to_s+"\n"+self.grid_ytop.to_s+"' > /var/www/html/maps/"+self.filename[0..self.filename.length-5]+".tfw"
  puts "Running "+cmd
  success = system( cmd )

end

def do_write_mapfile
  dummyWidth=20037508.34
  dummyHeight=20037508.34
  if self.pix_width>self.pix_height then
    dummyHeight=(self.pix_height.to_f/self.pix_width)*20037508.34
  end
  if self.pix_width<self.pix_height then
    dummyWidth=(self.pix_width.to_f/self.pix_height)*20037508.34
  end

  extentStr="-"+dummyWidth.to_s+" -"+dummyHeight.to_s+" "+dummyWidth.to_s+" "+dummyHeight.to_s

  cmd="cat /var/www/html/maps/maptemplate.map | sed -e 's/XXFILENAMEXX/"+self.filename+"/g' | sed -e 's/XXEXTENTXX/"+extentStr+"/g' > /var/www/html/maps/"+self.id.to_s+".map"
  puts "Running "+cmd
  success = system( cmd )
end

def do_compress
  cmd ="find /var/www/html/maps/tiles-"+self.id.to_s+" -name '*.xml' -delete"
  puts "Running "+cmd
  success = system( cmd )

  cmd=" find /var/www/html/maps/tiles-"+self.id.to_s+" -name '*.png' > /var/www/html/maps/tmp"+self.id.to_s+".lst; mogrify @/var/www/html/maps/tmp"+self.id.to_s+".lst -background white -alpha remove -quantize RGB -dither None -colors 255 -quantize RGB -dither None -colors 255; rm /var/www/html/maps/tm"+self.id.to_s+".lst"
  puts "Running "+cmd
  success = system( cmd )


end
#helpers

def arr_to_s(arr)
  text=""
  arr.each do |a|
    text=text+" "+a.to_s
  end
  text[1..-1]
end

end
