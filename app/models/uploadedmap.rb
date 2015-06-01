class Uploadedmap < ActiveRecord::Base

def destroy_files
    cmd="rm  /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )

    cmd="rm -r /var/www/html/mapspast/public/tiles/tiles-"+self.id.to_s
    puts "Running "+cmd
    success2 = system( cmd )

    (success and success2)
end

def is_geotiff?
   cmd="gdalinfo /home/mbriggs/"+self.filename+" | grep AUTHORITY | tail -n 1"
   projection=`#{cmd}`
   if projection and projection.length>0 then true else false end
end

def is_palette?
   cmd="gdalinfo /home/mbriggs/"+self.filename+" | grep Palette | tail -n 1"
   palette=`#{cmd}`
   if palette and palette.length>0 then true else false end
end

def is_rgba?
   cmd="gdalinfo /home/mbriggs/"+self.filename+" | grep 'Band 4' | tail -n 1"
   rgba=`#{cmd}`
   if rgba and rgba.length>0 then true else false end
end

def get_projection_from_gtiff
   cmd="gdalinfo /home/mbriggs/"+self.filename+" | grep AUTHORITY | tail -n 1"
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
   cmd="gdalinfo /home/mbriggs/"+self.filename+"| grep 'Size is' | sed -e 's/\,//g' | tail -n 1"
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
   if x and y then [x, y] else nil end
end
   
def get_extent_from_gtiff
   cmd="gdalinfo /home/mbriggs/"+self.filename+"| grep 'Upper Left' | sed -e 's/\,//g' | tail -n 1"
   str=`#{cmd}`

   arr=str.split(' ')

   if arr and arr.count>4 and arr[0]=="Upper"
     self.grid_xleft=arr[3].to_f
     self.grid_ytop=arr[4].to_f
   end

   cmd="gdalinfo /home/mbriggs/"+self.filename+"| grep 'Lower Right' | sed -e 's/\,//g' | tail -n 1"
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
   cmd="gdalinfo /home/mbriggs/"+self.filename+"| grep 'Pixel Size' | sed -e 's/,/ /g' | sed -e 's/(/ /g'| sed -e 's/)/ /g' | tail -n 1"
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

def do_get_file
  cmd="wget "+self.url+" -O /home/mbriggs/"+self.filename+" --no-check-certificate"
  puts "Running "+cmd
  success = system( cmd )
end

def do_nearwhite_nongeo
    cmd='mogrify /home/mbriggs/'+self.filename+' -format tif -fill "#FFFFFF" -opaque "#FEFEFE"'
    puts "Running "+cmd
    success = system( cmd )
end

def do_nearwhite
  cmd="listgeo /home/mbriggs/"+self.filename+" > /home/mbriggs/"+self.filename+".geo"
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd='mogrify /home/mbriggs/'+self.filename+' -format tif -fill "#FFFFFF" -opaque "#FEFEFE"'
    puts "Running "+cmd
    success = system( cmd )
  end
  
  if success  
    cmd="geotifcp -g /home/mbriggs/"+self.filename+".geo /home/mbriggs/"+self.filename+" /home/mbriggs/"+self.filename+"_nearwht.tif"
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="rm /home/mbriggs/"+self.filename+".geo /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /home/mbriggs/"+self.filename+"_nearwht.tif /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  success
end

def do_convert_to_tiff
  cmd='gdal_translate  /home/mbriggs/'+self.filename+'  /home/mbriggs/'+self.filename+'.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  self.filename=self.filename+'.tif'
end

def do_expand_palette
  cmd='gdal_translate  /home/mbriggs/'+self.filename+' -ot byte -expand rgb /home/mbriggs/'+self.filename+'_rgb.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /home/mbriggs/"+self.filename+"_rgb.tif /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end
  success
end

def do_crop_nogeo
  newwidth=self.pix_xright-self.pix_xleft
  newheight=self.pix_ybottom-self.pix_ytop
  cmd='convert  /home/mbriggs/'+self.filename+' -crop '+newwidth.to_s+'x'+newheight.to_s+'+'+self.pix_xleft.to_s+'+'+self.pix_ytop.to_s+' /home/mbriggs/'+self.filename+'_crop.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    self.pix_xleft=0
    self.pix_xright=newwidth
    self.pix_width=newwidth
    self.pix_ytop=0
    self.pix_ybottom=newheight
    self.pix_height=newheight
 
    cmd="rm /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /home/mbriggs/"+self.filename+"_crop.tif /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end
  success
end
 

def do_warp
  cmd='gdalwarp -overwrite -s_srs EPSG:'+self.source_srid.to_s+' -t_srs EPSG:2193 -r bilinear -dstnodata 255 -of Gtiff /home/mbriggs/'+self.filename+' /home/mbriggs/'+self.filename+'_warp.tif'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /home/mbriggs/"+self.filename+"_warp.tif /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  self.get_all_from_gtiff

  success
end

def do_to_rgb
  cmd='gdal_translate /home/mbriggs/'+self.filename+' /home/mbriggs/'+self.filename+'_rgb.tif -b 1 -b 2 -b 3'
  puts "Running "+cmd
  success = system( cmd )

  if success
    cmd="rm /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  if success
    cmd="mv /home/mbriggs/"+self.filename+"_rgb.tif /home/mbriggs/"+self.filename
    puts "Running "+cmd
    success = system( cmd )
  end

  success

end

def do_tile
  cmd='gdal2tiles.py -z 5-'+self.maxzoom.to_s+' -r bilinear --srcnodata 255 /home/mbriggs/'+self.filename+' /var/www/html/mapspast/public/tiles/tiles-'+self.id.to_s
  puts "Running "+cmd
  success = system( cmd )

  success
end

def do_georeference
cmd ="echo '"+self.xresolution.to_s+"\n0\n0\n"+(-self.yresolution).to_s+"\n"+self.grid_xleft.to_s+"\n"+self.grid_ytop.to_s+"' > /home/mbriggs/"+self.filename[0..self.filename.length-5]+".tfw"
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
