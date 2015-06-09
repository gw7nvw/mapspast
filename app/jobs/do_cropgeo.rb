class Do_cropgeo
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      success=map.do_crop_geo
      if success then 
        map.mapstatus=Mapstatus.find_by(:name => "cropped")
        map.get_all_from_gtiff
        map.crop_done=true
        map.rotate_done=true
        map.save
      else map.mapstatus=Mapstatus.find_by(:name => "converted")
      end
      puts "done"

  end 

end

