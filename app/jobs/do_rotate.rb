class Do_rotate
  @queue = :sleep
 
  def self.perform(map_id)
      puts "start"
      map=Uploadedmap.find_by_id(map_id)
      success=map.do_rotate_nongeo
      if success then 
        map.mapstatus=Mapstatus.find_by(:name => "rotated")
        map.get_size_from_gtiff
        map.save
        map.do_write_mapfile
      else map.mapstatus=Mapstatus.find_by(:name => "converted")
      end
      puts "done"

  end 

end

