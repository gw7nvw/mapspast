class Do_create
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      map.create_extent_polygon
      map.mapstatus=Mapstatus.find_by(:name => "nearwhite ...")
      map.save
      success=map.do_nearwhite 

      if success then
        map.mapstatus=Mapstatus.find_by(:name => "warping ...")
        map.save
        success=map.do_warp
        if !success then
           map.mapstatus=Mapstatus.find_by(:name => "cropped")
           map.errortext="Warp failed - please check georeferencingi and projection is correct"
        end
      end
   
         
      if success then
        map.mapstatus=Mapstatus.find_by(:name => "converting to rgb ...")
        map.save
        map.calc_max_zoom
        success=map.do_to_rgb
        if !success then
           map.mapstatus=Mapstatus.find_by(:name => "warped")
           map.errortext="Convert to RGB failed - there's something strange about the colour bands in this image"
        end

      end
      if success then
        map.mapstatus=Mapstatus.find_by(:name => "tiling ...")
        map.save
        success=map.do_tile
        if !success then
           map.mapstatus=Mapstatus.find_by(:name => "warped")
           map.errortext="Tiling failed. This should not have happened - please info the site owner"
        end
      end
      if success then 
        map.publish
        map.mapstatus=Mapstatus.find_by(:name => "compressing ...")
        map.save
        success=map.do_compress
        if !success then
           map.mapstatus=Mapstatus.find_by(:name => "tiled")
           map.errortext="Compression failed. This should not have happened but your map should still be available"
        end
      end

      if success then
        map.mapstatus=Mapstatus.find_by(:name => "compressed")
        map.save
      end
      puts "done"

  end 

end

