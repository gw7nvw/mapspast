class Do_create
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      map.mapstatus=Mapstatus.find_by(:name => "nearwhite ...")
      map.save
      success=map.do_nearwhite 
      if success then
        map.mapstatus=Mapstatus.find_by(:name => "warping ...")
        map.save
        success=map.do_warp
      end
      if success then
        map.mapstatus=Mapstatus.find_by(:name => "converting to rgb ...")
        map.save
        map.calc_max_zoom
        success=map.do_to_rgb
      end
      if success then
        map.mapstatus=Mapstatus.find_by(:name => "tiling ...")
        map.save
        success=map.do_tile
      end
      if success then 
        map.mapstatus=Mapstatus.find_by(:name => "compressing ...")
        map.save
        success=map.do_compress
      end

      if success then
        map.mapstatus=Mapstatus.find_by(:name => "compressed")
        map.save
      end
      puts "done"

  end 

end

